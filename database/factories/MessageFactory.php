<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected static $userIds = null;
    protected static $groupIds = null;

    public function definition(): array
    {
        self::$userIds ??= User::pluck('id')->toArray();
        self::$groupIds ??= Group::pluck('id')->toArray();

        $otherUserIds = array_filter(self::$userIds, fn($id) => $id != 1);

        $senderId = $this->faker->randomElement([0, 1]);

        if ($senderId === 0) {
            $senderId = $this->faker->randomElement($otherUserIds);
            $receiverId = 1;
        } else {
            $senderId = 1; 
            $receiverId = $this->faker->randomElement($otherUserIds);
        }

        $groupId = null;
        if ($this->faker->boolean(50) && !empty(self::$groupIds)) {
            $groupId = $this->faker->randomElement(self::$groupIds);
            $group = Group::find($groupId);
            $senderId = $this->faker->randomElement($group->users->pluck('id')->toArray());
            $receiverId = null;
        }

        return [
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
            'message' => $this->faker()->realText(200),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
