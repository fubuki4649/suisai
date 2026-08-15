import {Card, Separator} from "@heroui/react";
import React from "react";

export interface MetadataCardProps {
  file_name: string;
  size_on_disk: number;
  photo_date: Date;
  photo_timezone: string;
  resolution_width: number;
  resolution_height: number;
  mime_type: string;
  camera_model: string;
  lens_model: string;
  shutter_count: number;
  focal_length: number;
  iso: number;
  shutter_speed: string;
  aperture: number;
}

function InfoField({label, data}: {label: string; data: string}) {
  return (
    <div className="flex flex-row w-full justify-between items-center py-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{data}</span>
    </div>
  );
}

export function MetadataCard(props: MetadataCardProps) {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: props.photo_timezone,
    timeZoneName: "short",
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: props.photo_timezone,
  };

  return (
    <Card className="h-fit w-80 rounded-2xl bg-surface border border-separator shadow-md p-4">
      <Card.Header className="pb-1 flex-col items-start">
        <Card.Title className="font-semibold text-base truncate w-full text-foreground">{props.file_name}</Card.Title>
      </Card.Header>
      <Card.Content className="pt-2 flex-col gap-1 items-start">
        <p className="pb-1 text-xs text-muted uppercase font-semibold tracking-wider">File Properties</p>
        <InfoField label={"Size on Disk"} data={`${(props.size_on_disk / 1024).toFixed(2)} MB`} />
        <InfoField label={"Photo Date"} data={props.photo_date.toLocaleDateString("en-US", dateOptions).replace(",", "")} />
        <InfoField label={"Photo Time"} data={props.photo_date.toLocaleTimeString("en-US", timeOptions).replace(/\s([A-Z]+)$/, " ($1)")} />
        <InfoField label={"Resolution"} data={props.resolution_width + "x" + props.resolution_height} />
        <InfoField label={"MIME Type"} data={props.mime_type} />

        <Separator className="my-2" />

        <p className="pb-1 text-xs text-muted uppercase font-semibold tracking-wider">Camera Info</p>
        <InfoField label={"Camera Model"} data={props.camera_model} />
        <InfoField label={"Lens Model"} data={props.lens_model} />
        <InfoField label={"Shutter Count"} data={props.shutter_count.toString()} />

        <Separator className="my-2" />

        <p className="pb-1 text-xs text-muted uppercase font-semibold tracking-wider">Photo Info</p>
        <InfoField label={"Focal Length"} data={props.focal_length + "mm"} />
        <InfoField label={"ISO Sensitivity"} data={"ISO " + props.iso} />
        <InfoField label={"Shutter Speed"} data={props.shutter_speed} />
        <InfoField label={"Aperture"} data={`ƒ/${props.aperture.toFixed(1)}`} />
      </Card.Content>
    </Card>
  );
}

export default MetadataCard;
