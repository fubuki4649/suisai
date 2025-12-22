import React from "react";
import {Album} from "../../../api/models.ts";
import RightClickButton from "../../../components/right_click_button/RightClickButton.tsx";
import {Disclosure} from "../../../components/modal-disclosure.ts";

interface AlbumButtonProps {
  album: Album;
  expanded: boolean;
  selectedAlbum: Album | null;
  onAlbumSelect: (album: Album) => void;
  setRightClickAlbum: (album: Album) => void;
  renameAlbumDisclosure: Disclosure;
  moveAlbumDisclosure: Disclosure;
  deleteAlbumDisclosure: Disclosure;
}

const AlbumButton: React.FC<AlbumButtonProps> = ({
  album,
  expanded,
  selectedAlbum,
  onAlbumSelect,
  setRightClickAlbum,
  renameAlbumDisclosure,
  moveAlbumDisclosure,
  deleteAlbumDisclosure,
}) => {
  return (
    <RightClickButton
      btnProps={{
        className: "px-4 text-medium",
        children: album.albumName,
        color: "default",
        variant: selectedAlbum?.albumId === album.albumId ? "faded" : (expanded ? "flat" : "light"),
        onPress: () => onAlbumSelect(album),
      }}
      rightClickItems={[
        {
          key: "rename",
          children: "Rename",
          isDisabled: album.albumId < 0,
          onPress: () => {
            setRightClickAlbum(album);
            renameAlbumDisclosure.onOpen();
          },
        },
        {
          key: "move",
          children: "Move",
          isDisabled: album.albumId < 0,
          onPress: () => {
            setRightClickAlbum(album);
            moveAlbumDisclosure.onOpen();
          },
        },
        {
          key: "delete",
          className: "text-danger",
          color: "danger",
          children: "Delete",
          isDisabled: album.albumId < 0,
          onPress: () => {
            setRightClickAlbum(album);
            deleteAlbumDisclosure.onOpen();
          },
        },
      ]}
    />
  );
};

export default AlbumButton;
