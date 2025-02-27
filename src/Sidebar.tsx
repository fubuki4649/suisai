import {Button, Divider, Link, NavbarMenuItem, Spacer} from "@heroui/react";
import {Card, CardBody} from "@heroui/react";
import React from "react";
import {PlusIcon} from "@heroicons/react/24/solid";


function Sidebar() {

  const sidebarItemsPlaceholder = [
    "YYZ Precovid",
    "YYZ Postcovid",
    "YHM",
    "Aruba",
    "New York-JFK",
    "New York",
    "Fort Lauderdale-FLL",
    "Miami-MIA",
    "Miami",
    "Kennedy Space Center",
  ];

  return (

    <div className={"flex flex-col bg-background p-4 space-y-2"}>

      {sidebarItemsPlaceholder.map(item => (
        <Button color="default" variant="light">
          {item}
        </Button>
      ))}

      <Spacer className={"h-1"}/>
      <Button color="default" variant="ghost" endContent={<PlusIcon className={"size-6"}/>}>
        <Spacer className={"w-0"}/>
        <p className={"font-semibold"}>Add Album</p>
      </Button>

    </div>

  )
}

export default Sidebar
