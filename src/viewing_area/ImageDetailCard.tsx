import {Card, CardBody, CardHeader, Divider} from "@heroui/react";
import React, {ReactNode} from "react";


function InfoField({label, data}: {label: string, data: string}) {
  return (
    <div className="flex flex-row w-full justify-between">
      <small className="text-default-500">{label}</small>
      <p className="text-small font-bold">{data}</p>
    </div>
  )
}

function ImageDetailCard() {
  return (
    <Card shadow="sm" className="h-fit w-80 m-6">
      <CardHeader className="pb-0 pt-3 px-4 flex-col items-start">
        <h4 className="font-bold text-large">IMG_4359.ARW</h4>
        <small className="text-default-600 opacity-90">/btrfs/suisai/yyz_precovid/IMG_4359.ARW</small>
      </CardHeader>
      <CardBody className="p-4 flex-col gap-1 items-start">
        <p className="pb-1 text-tiny text-white/60 uppercase font-bold">File Properties</p>
        <InfoField label={"Size on Disk"} data={"49.9MB"} />
        <InfoField label={"Photo Time"} data={"2025:02:17 17:05:06"} />
        <InfoField label={"Resolution"} data={"6000x4000"} />
        <InfoField label={"MIME Type"} data={"image/x-sony-arw"} />
        <Divider className="my-2" />
        <p className="pb-1 text-tiny text-white/60 uppercase font-bold">Camera Info</p>
        <InfoField label={"Camera Model"} data={"Sony ILCE-9"} />
        <InfoField label={"Lens Model"} data={"Tamron 70-300mm F4.5-6.3 Di III RXD"} />
        <InfoField label={"Shutter Count"} data={"99233"} />
        <Divider className="my-2" />
        <p className="pb-1 text-tiny text-white/60 uppercase font-bold">Photo Info</p>
        <InfoField label={"Focal Length"} data={"210mm"} />
        <InfoField label={"ISO Setting"} data={"100"} />
        <InfoField label={"Shutter Speed"} data={"1/1250"} />
        <InfoField label={"Aperture"} data={"5.6"} />
      </CardBody>
    </Card>
  )
}

export default ImageDetailCard
