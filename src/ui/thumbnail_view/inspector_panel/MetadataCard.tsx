import {Card, CardBody, CardHeader, Divider} from "@heroui/react";
import React from "react";

import {MetadataCardProps} from "./ViewModel.ts";


function InfoField({label, data}: {label: string, data: string}) {
  return (
    <div className="flex flex-row w-full justify-between">
      <small className="text-default-500">{label}</small>
      <p className="text-small font-bold">{data}</p>
    </div>
  )
}

function MetadataCard(props: MetadataCardProps) {

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: props.photoTimezone,
    timeZoneName: 'short',
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: props.photoTimezone
  };


  return (
    <Card shadow="md" className="h-fit w-80">
      <CardHeader className="pb-0 pt-3 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{props.fileName}</h4>
      </CardHeader>
      <CardBody className="p-4 pt-2 flex-col gap-1 items-start">
        <p className="pb-1 text-tiny text-white/60 uppercase font-bold">File Properties</p>
        <InfoField label={"Size on Disk"} data={`${(props.sizeOnDisk / 1024).toFixed(2)} MB`} />
        <InfoField label={"Photo Date"} data={props.photoDate.toLocaleDateString('en-US', dateOptions).replace(',', '')} />
        <InfoField label={"Photo Time"} data={props.photoDate.toLocaleTimeString('en-US', timeOptions).replace(/\s([A-Z]+)$/, ' ($1)')} />
        <InfoField label={"Resolution"} data={props.resolution[0] + 'x' + props.resolution[1]} />
        <InfoField label={"MIME Type"} data={props.mimeType} />
        <Divider className="my-2" />
        <p className="pb-1 text-tiny text-white/60 uppercase font-bold">Camera Info</p>
        <InfoField label={"Camera Model"} data={props.cameraModel} />
        <InfoField label={"Lens Model"} data={props.lensModel} />
        <InfoField label={"Shutter Count"} data={props.shutterCount.toString()} />
        <Divider className="my-2" />
        <p className="pb-1 text-tiny text-white/60 uppercase font-bold">Photo Info</p>
        <InfoField label={"Focal Length"} data={props.focalLength + "mm"} />
        <InfoField label={"ISO Sensitivity"} data={"ISO " + props.iso} />
        <InfoField label={"Shutter Speed"} data={props.shutterSpeed} />
        <InfoField label={"Aperture"} data={props.aperture.toFixed(1)} />
      </CardBody>
    </Card>
  )
}

export default MetadataCard
