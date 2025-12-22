import {
  addToast,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer
} from "@heroui/react";
import React, {useEffect, useState} from "react";
import {useAlbums, useDarkMode} from "../../../../components/GlobalContext.tsx";
import {getAlbums, getAlbumsFlat} from "../../../../api/endpoints/album.ts";
import {Album} from "../../../../api/models.ts";
import {AlbumModalProps} from "./props.ts";
import {moveAlbum, unfileAlbum} from "../../../../api/endpoints/management.ts";

export function MoveAlbumModal(props: AlbumModalProps) {

  const [darkMode] = useDarkMode();
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [, setAlbums] = useAlbums();

  const {isOpen, onOpenChange} = props.disclosure;
  const [modalSelectedAlbum, setModalSelectedAlbum] = useState<Album | null>(null);

  // Fetch album list
  useEffect(() => {
    if (props.disclosure.isOpen) {
      getAlbumsFlat().then((result) => {
        // Remove the option to move the album to itself
        setAlbumList(result.filter((album) => album.albumId != props.album.albumId));
      })
    }
  }, [props.disclosure.isOpen])

  // Event handler for move photo button
  const onMoveAlbum = () => {
    // On Success - Display toast + update frontend
    const onSuccess = (message: string) => {
      addToast({
        title: "Success",
        description: message,
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });

      // Update album list on left rail
      getAlbums().then((albums: Album[]) => {
        setAlbums(albums);
      });
    }

    // On Error - Display error
    const onError = (code: number, message: string) => {
      addToast({
        title: "Error",
        description: message + " (Code: " + code + ")",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      })
    }

    // Move album (or unfile if album id is -1)
    if (modalSelectedAlbum!.albumId === -1) {
      unfileAlbum([props.album.albumId], (code) => {
        onError(code, "Failed to move album");
      }).then(() => {
        onSuccess(`Successfully moved ${props.album.albumName} to root`);
      });
    }
    else {
      moveAlbum(modalSelectedAlbum!.albumId, [props.album.albumId], (code) => {
        onError(code, "Failed to move photos");
      }).then(() => {
        onSuccess(`Successfully moved ${props.album.albumName} to ${modalSelectedAlbum?.albumName}`);
      });
    }

  }

  return (
    <>
      <Modal
        className={cn(darkMode && "dark text-foreground")}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setModalSelectedAlbum(null);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Move Album</ModalHeader>
              <ModalBody>

                <p>
                  Moving album "{props.album.albumName}" to the following album
                </p>

                <Spacer className="h-1"/>

                <Dropdown className={cn(darkMode && "dark text-foreground")} placement="bottom-start">
                  <DropdownTrigger>
                    <div>
                      <Input
                        isReadOnly
                        label="Destination Album"
                        value={modalSelectedAlbum?.albumName ?? ""}
                        type="text"
                        placeholder="Select Album"
                        size="md"
                        labelPlacement="inside"
                      />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dynamic Actions" items={albumList}>
                    {(album) => (
                      <DropdownItem key={album.albumId} onPress={() => {setModalSelectedAlbum(album);}}>
                        {album.albumName} (ID: {album.albumId})
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {onMoveAlbum(); onClose();}} isDisabled={modalSelectedAlbum == null}>
                  Move Album
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MoveAlbumModal;
