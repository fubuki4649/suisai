import {Card, CardBody} from "@heroui/react";
import React, {useState} from "react";
import clsx from 'clsx';


function PhotoCard() {
  const [darkMode] = useState(true)

  return (
    <Card>
      <CardBody>meow</CardBody>
    </Card>
  )
}

export default PhotoCard
