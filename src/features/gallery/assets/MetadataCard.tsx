import {Card, CardBody, CardHeader, Divider} from "@heroui/react";
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
    <div className="flex flex-row w-full justify-between">
      <small className="text-default-500">{label}</small>
      <p className="text-small font-bold">{data}</p>
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
    <Card shadow="md" className="h-fit w-80">
      <CardHeader className="pb-0 pt-3 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{props.file_name}</h4>
      </CardHeader>
      <CardBody className="p-4 pt-2 flex-col gap-1 items-start">
        <p className="pb-1 text-tiny text-default-800 uppercase font-bold">File Properties</p>
        <InfoField label={"Size on Disk"} data={`${(props.size_on_disk / 1024).toFixed(2)} MB`} />
        <InfoField label={"Photo Date"} data={props.photo_date.toLocaleDateString("en-US", dateOptions).replace(",", "")} />
        <InfoField label={"Photo Time"} data={props.photo_date.toLocaleTimeString("en-US", timeOptions).replace(/\s([A-Z]+)$/, " ($1)")} />
        <InfoField label={"Resolution"} data={props.resolution_width + "x" + props.resolution_height} />
        <InfoField label={"MIME Type"} data={props.mime_type} />
        <Divider className="my-2" />
        <p className="pb-1 text-tiny text-default-800 uppercase font-bold">Camera Info</p>
        <InfoField label={"Camera Model"} data={props.camera_model} />
        <InfoField label={"Lens Model"} data={props.lens_model} />
        <InfoField label={"Shutter Count"} data={props.shutter_count.toString()} />
        <Divider className="my-2" />
        <p className="pb-1 text-tiny text-default-800 uppercase font-bold">Photo Info</p>
        <InfoField label={"Focal Length"} data={props.focal_length + "mm"} />
        <InfoField label={"ISO Sensitivity"} data={"ISO " + props.iso} />
        <InfoField label={"Shutter Speed"} data={props.shutter_speed} />
        <InfoField label={"Aperture"} data={props.aperture.toFixed(1)} />
      </CardBody>
    </Card>
  );
}

export default MetadataCard;
