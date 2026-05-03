"use client";

import type { ProductOptionGroup, ProductOptionValue } from "./product-form.types";

type Props = {
  optionGroups: ProductOptionGroup[];
  onChange: (items: ProductOptionGroup[]) => void;
};

function buildEmptyOptionValue(): ProductOptionValue {
  return {
    id: crypto.randomUUID(),
    valueEn: "",
    valueAr: "",
    optionCode: "",
    isDefault: false,
  };
}

function buildEmptyOptionGroup(): ProductOptionGroup {
  const initialValue = buildEmptyOptionValue();

  return {
    id: crypto.randomUUID(),
    nameEn: "",
    nameAr: "",
    slug: "",
    options: [{ ...initialValue, isDefault: true }],
    selectedValueId: initialValue.id,
  };
}

export function ProductOptionGroups({ optionGroups, onChange }: Props) {
  const updateGroup = (
    groupId: string,
    updater: (group: ProductOptionGroup) => ProductOptionGroup
  ) => {
    onChange(optionGroups.map((group) => (group.id === groupId ? updater(group) : group)));
  };

  const addGroup = () => {
    onChange([...optionGroups, buildEmptyOptionGroup()]);
  };

  const removeGroup = (groupId: string) => {
    onChange(optionGroups.filter((group) => group.id !== groupId));
  };

  const addValue = (groupId: string) => {
    updateGroup(groupId, (group) => {
      const nextValue = buildEmptyOptionValue();
      const nextOptions = [
        ...group.options,
        {
          ...nextValue,
          isDefault: group.options.length === 0,
        },
      ];

      return {
        ...group,
        options: nextOptions,
        selectedValueId: group.selectedValueId ?? nextValue.id,
      };
    });
  };

  const removeValue = (groupId: string, valueId: string) => {
    updateGroup(groupId, (group) => {
      const nextOptions = group.options.filter((option) => option.id !== valueId);
      const nextDefault = nextOptions.find((option) => option.isDefault) ?? nextOptions[0] ?? null;

      return {
        ...group,
        options: nextOptions.map((option) => ({
          ...option,
          isDefault: nextDefault ? option.id === nextDefault.id : false,
        })),
        selectedValueId: nextDefault?.id ?? null,
      };
    });
  };

  const setDefaultValue = (groupId: string, valueId: string) => {
    updateGroup(groupId, (group) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        isDefault: option.id === valueId,
      })),
      selectedValueId: valueId,
    }));
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Custom Product Options</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add selectors like Tip Type, Line Width, Pack Size, or any other product-specific choice.
          </p>
        </div>

        <button
          type="button"
          onClick={addGroup}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Add Option Group
        </button>
      </div>

      <div className="space-y-4">
        {optionGroups.map((group) => (
          <div key={group.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {group.nameEn || group.nameAr || "New option group"}
                </p>
                <p className="text-xs text-slate-500">
                  Shown on the product page as a selectable row of options.
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeGroup(group.id)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Delete Group
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600">Group Name (EN)</label>
                <input
                  type="text"
                  value={group.nameEn}
                  onChange={(event) =>
                    updateGroup(group.id, (currentGroup) => ({
                      ...currentGroup,
                      nameEn: event.target.value,
                    }))
                  }
                  placeholder="Tip Type"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-right text-sm font-medium text-slate-600">
                  اسم المجموعة (AR)
                </label>
                <input
                  dir="rtl"
                  type="text"
                  value={group.nameAr}
                  onChange={(event) =>
                    updateGroup(group.id, (currentGroup) => ({
                      ...currentGroup,
                      nameAr: event.target.value,
                    }))
                  }
                  placeholder="نوع السن"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {group.options.map((option) => (
                <div key={option.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_180px_auto]">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Option (EN)</label>
                      <input
                        type="text"
                        value={option.valueEn}
                        onChange={(event) =>
                          updateGroup(group.id, (currentGroup) => ({
                            ...currentGroup,
                            options: currentGroup.options.map((currentOption) =>
                              currentOption.id === option.id
                                ? { ...currentOption, valueEn: event.target.value }
                                : currentOption
                            ),
                          }))
                        }
                        placeholder="Bullet"
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-right text-sm font-medium text-slate-600">
                        الخيار (AR)
                      </label>
                      <input
                        dir="rtl"
                        type="text"
                        value={option.valueAr}
                        onChange={(event) =>
                          updateGroup(group.id, (currentGroup) => ({
                            ...currentGroup,
                            options: currentGroup.options.map((currentOption) =>
                              currentOption.id === option.id
                                ? { ...currentOption, valueAr: event.target.value }
                                : currentOption
                            ),
                          }))
                        }
                        placeholder="مدبب"
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Optional Code</label>
                      <input
                        type="text"
                        value={option.optionCode}
                        onChange={(event) =>
                          updateGroup(group.id, (currentGroup) => ({
                            ...currentGroup,
                            options: currentGroup.options.map((currentOption) =>
                              currentOption.id === option.id
                                ? { ...currentOption, optionCode: event.target.value }
                                : currentOption
                            ),
                          }))
                        }
                        placeholder="1.0 mm"
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="flex items-end gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => setDefaultValue(group.id, option.id)}
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                          option.isDefault
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Default
                      </button>
                      <button
                        type="button"
                        onClick={() => removeValue(group.id, option.id)}
                        className="rounded-xl border border-rose-200 px-3 py-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addValue(group.id)}
                className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                + Add Option Value
              </button>
            </div>
          </div>
        ))}

        {optionGroups.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No custom selectors added yet. Add one for things like line width or tip type.
          </div>
        )}
      </div>
    </div>
  )
}
