import React from "react";
import {Album} from "../../../models/model.ts";
import RightClickButton from "../../components/RightClickButton.tsx";
import {Disclosure} from "../../../models/modal-disclosure.ts";

interface AlbumButtonProps {
  album: Album;
  selectedAlbum: Album | null;
  onAlbumSelect: (album: Album) => void;
  setRightClickAlbum: (album: Album) => void;
  renameAlbumDisclosure: Disclosure;
  deleteAlbumDisclosure: Disclosure;
}

const AlbumButton: React.FC<AlbumButtonProps> = ({
  album,
  selectedAlbum,
  onAlbumSelect,
  setRightClickAlbum,
  renameAlbumDisclosure,
  deleteAlbumDisclosure,
}) => {
  return (
    <RightClickButton
      btnProps={{
        className: "px-4 text-medium",
        children: album.albumName,
        color: "default",
        variant: selectedAlbum?.albumId === album.albumId ? "flat" : "light",
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
