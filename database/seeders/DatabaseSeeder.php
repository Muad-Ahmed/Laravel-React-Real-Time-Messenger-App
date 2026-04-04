<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'john doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true
        ]);

        User::factory()->create([
            'name' => 'jane doe',
            'email' => 'jane@example.com',
            'password' => bcrypt('password'),
        ]);

        User::factory()->create([
            'name' => 'demo user',
            'email' => 'dev.access@company.com',
            'password' => bcrypt('secret_token_99'),
            'is_admin' => true
        ]);

        User::factory(10)->create();

        // Copy seed images from the repo into storage so they exist on any server
        $destPath = storage_path('app/public/avatars');
        File::ensureDirectoryExists($destPath);
        foreach (['user1.jpg', 'user2.jpg', 'user3.jpg', 'user4.jpg'] as $img) {
            $src = database_path('seeders/images/' . $img);
            if (File::exists($src)) {
                File::copy($src, $destPath . '/' . $img);
            }
        }

        $avatars = [
            'avatars/user1.jpg',
            'avatars/user2.jpg',
            'avatars/user3.jpg',
            'avatars/user4.jpg',
        ];

        shuffle($avatars);

        $users = User::inRandomOrder()->limit(4)->get();

        foreach ($users as $index => $user) {
            $user->update([
                'avatar' => $avatars[$index],
            ]);
        }        


        for ($i = 0; $i < 5; $i++) {
            $group = Group::factory()->create([
                'owner_id' => 1,
            ]);

            $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            $group->users()->attach(array_unique([1, ...$users]));
        }

        Message::factory(1000)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at')
            ->get();

        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])
                ->sort()->implode('_');
        })->map(function ($groupedMessages) {
            return [
                'user_id1' => $groupedMessages->first()->sender_id,
                'user_id2' => $groupedMessages->first()->receiver_id,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
