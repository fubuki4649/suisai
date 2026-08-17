import React, {useState} from "react";
import {Button, Modal} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useServerHealth} from "../context/ServerHealthContext.tsx";
import {BACKEND_URL} from "../config.ts";

export function ServerOfflineModal() {
  const {isOffline, isChecking, retryConnection} = useServerHealth();
  const [retryFailed, setRetryFailed] = useState(false);

  const handleRetry = async () => {
    setRetryFailed(false);
    const recovered = await retryConnection();
    if (!recovered) {
      setRetryFailed(true);
    } else {
      window.location.reload();
    }
  };

  return (
    <Modal isOpen={isOffline}>
      <Modal.Backdrop
        variant="blur"
        isDismissable={false}
        className="bg-black/60 backdrop-blur-md"
      >
        <Modal.Container size="sm">
          <Modal.Dialog className="p-6">
            <Modal.Header className="flex items-center gap-3 pb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-danger/10 text-danger shrink-0">
                <Icon icon="gravity-ui:triangle-exclamation-fill" className="w-5 h-5" />
              </div>
              <div>
                <Modal.Heading className="text-lg font-semibold text-foreground text-center">
                  Server Offline
                </Modal.Heading>
                <p className="text-xs text-muted text-center">
                  Backend connection failed
                </p>
              </div>
            </Modal.Header>

            <Modal.Body className="py-3 space-y-2">
              <p className="text-sm text-muted leading-relaxed">
                Unable to establish a connection with server. The backend at {" "}
                <code className="px-1.5 py-0.5 rounded bg-default-100 dark:bg-default-50/10 font-mono text-xs text-foreground font-semibold">
                  {BACKEND_URL}
                </code> is unreachable.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Please make sure everything is configured correctly and is running and try again.
              </p>
              {retryFailed && (
                <div className="mt-6 p-2.5 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger flex items-center gap-2">
                  <Icon icon="gravity-ui:circle-exclamation-fill" className="w-4 h-4 shrink-0" />
                  <span>Connection failed. Server still unreachable.</span>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer className="flex justify-center">
              <Button
                variant="primary"
                isDisabled={isChecking}
                onPress={handleRetry}
                className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon icon="gravity-ui:arrows-rotate-right" className={isChecking ? "animate-spin w-4 h-4" : "w-4 h-4"} />
                <span>{isChecking ? "Checking Connection..." : "Try Again / Reload"}</span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default ServerOfflineModal;
