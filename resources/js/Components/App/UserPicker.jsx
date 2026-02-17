import { Fragment, useState } from "react";
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function UserPicker({ value, options, onSelect }) {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    const filteredPeople =
        query === ""
            ? options
            : options.filter((person) =>
                  person.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, "")),
              );

    const onSelected = (persons) => {
        setSelected(persons);
        onSelect(persons);
    };

    return (
        <>
            <Combobox value={selected} onChange={onSelected} multiple>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default max-h-[100px] overflow-hidden rounded-xl text-left border border-slate-200 dark:border-white/10 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                        <ComboboxInput
                            className="w-full border-none py-3 pl-4 pr-10 text-sm leading-5 bg-white dark:bg-slate-800/50 dark:text-slate-100 focus:ring-0 placeholder-slate-400"
                            displayValue={(persons) =>
                                persons.length
                                    ? `${persons.length} users selected`
                                    : ""
                            }
                            placeholder="Search and select users..."
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3 group">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors"
                                aria-hidden="true"
                            />
                        </ComboboxButton>
                    </div>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <ComboboxOptions className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 py-1.5 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm z-[60]">
                            {filteredPeople.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-3 text-slate-500 italic">
                                    No users found matching "{query}"
                                </div>
                            ) : (
                                filteredPeople.map((person) => (
                                    <ComboboxOption
                                        key={person.id}
                                        value={person}
                                        className={({ focus }) =>
                                            `relative cursor-default select-none py-2.5 pl-10 pr-4 transition-colors ${
                                                focus
                                                    ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                                                    : "text-slate-700 dark:text-slate-200"
                                            }`
                                        }
                                    >
                                        {({ selected, focus }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? "font-bold text-indigo-500" : "font-normal"}`}
                                                >
                                                    {person.name}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? "text-indigo-500" : "text-indigo-500"}`}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5 drop-shadow-[0_0_5px_rgba(99,102,241,0.4)]"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </ComboboxOption>
                                ))
                            )}
                        </ComboboxOptions>
                    </Transition>
                </div>
            </Combobox>

            {/* display selected users */}
            {selected && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {selected.map((person) => (
                        <div
                            key={person.id}
                            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 rounded-full text-xs font-bold animate-in zoom-in-95 duration-200 shadow-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            {person.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
