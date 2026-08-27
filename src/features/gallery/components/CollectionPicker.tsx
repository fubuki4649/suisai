import React from "react";
import { Label, ListBox, Select } from "@heroui/react";
import { Collection } from "../../../types/models.ts";

interface CollectionPickerProps {
  collections: Collection[];
  value: Collection | null;
  onChange: (collection: Collection | null) => void;
  label?: string;
}

export default function CollectionPicker({
  collections,
  value,
  onChange,
  label = "Destination Collection",
}: CollectionPickerProps) {
  return (
    <Select
      placeholder="Select Destination Collection"
      value={value?.id ?? null}
      onChange={(key) => {
        const selected = collections.find((c) => c.id === key) ?? null;
        onChange(selected);
      }}
    >
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Select.Trigger className="w-full">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="max-h-60 overflow-y-auto">
        <ListBox>
          {collections.map((item) => (
            <ListBox.Item key={item.id} id={item.id} textValue={`${item.label} (${item.id})`}>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted">ID: {item.id}</span>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
