import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonText,
  ButtonGroup,
  ButtonIcon,
} from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { Icon, CloseIcon } from "@/components/ui/icon";
import React from "react";
import { Check } from "lucide-react-native";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "react-native";

type Params = {
  onClickView: () => void;
};
export default function useSlotsFormToast({ onClickView }: Params) {
  const toast = useToast();
  const [toastId, setToastId] = React.useState(uuidv4());
  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast();
    }
  };
  const showNewToast = () => {
    const newId = uuidv4();
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "bottom",
      duration: 5000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast
            nativeID={uniqueToastId}
            className="p-4 gap-4 w-full max-w-[386px] bg-background-0 shadow-hard-2 flex-row"
          >
            <Box className="h-11 w-11 items-center justify-center hidden min-[400px]:flex bg-background-50">
              <Icon as={Check} size="xl" className="stroke-background-800" />
            </Box>
            <VStack space="xl">
              <VStack space="xs">
                <HStack className="justify-between">
                  <ToastTitle className="text-typography-900 font-semibold">
                    New slot added
                  </ToastTitle>
                  <Button
                    onPress={() => {
                      toast.close(id);
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-full p-3.5"
                  >
                    <ButtonIcon as={CloseIcon} />
                  </Button>
                </HStack>
                <ToastDescription className="text-typography-700">
                  A new slot has been created successfully
                </ToastDescription>
              </VStack>
              <ButtonGroup className="gap-3 flex-row">
                <Button
                  action="secondary"
                  variant="outline"
                  size="sm"
                  className="flex-grow"
                  onPress={() => {
                    toast.close(id);

                    onClickView();
                  }}
                >
                  <ButtonText>View slots</ButtonText>
                </Button>
                <Button
                  size="sm"
                  className="flex-grow"
                  onPress={() => {
                    toast.close(id);
                  }}
                >
                  <ButtonText>Done</ButtonText>
                </Button>
              </ButtonGroup>
            </VStack>
          </Toast>
        );
      },
    });
  };
  return {
    handleToast,
  };
}
