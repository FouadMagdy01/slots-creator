import { FlatList, StyleSheet, Modal as RNModal } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";

import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import { CircleIcon, CloseIcon, SearchIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { getTimeZones, TimezoneInfo } from "@/utils/helpers/dateTimeHelpers";

type Props = {
  onClose: () => void;
  onReset: () => void;
  visible: boolean;
  onChangeTimezone: (timezone: string) => void;
  selectedTimezone: string;
};
const TimezoneSelectionModal: React.FC<Props> = ({
  onClose,
  visible,
  onReset,
  onChangeTimezone,
  selectedTimezone,
}) => {
  const [timezonesSearchQuery, setTimezonesSearchQuery] = useState("");
  const [timezones, setTimezones] = useState<TimezoneInfo>([]);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    onClose();
  };

  const handleReset = () => {
    onReset();
  };

  useEffect(() => {
    //simulate loading
    let timeout: any;
    if (visible) {
      setLoading(true);
      timeout = setTimeout(() => {
        setLoading(false);
        setTimezones(getTimeZones());
      }, 500);
    } else {
      setTimezones([]);
    }
    return () => {
      clearTimeout(timeout);
      setTimezonesSearchQuery("");
    };
  }, [visible]);

  const filteredTimezones = useMemo(() => {
    if (timezonesSearchQuery.trim().length == 0) {
      return timezones;
    } else {
      return timezones.filter((item) =>
        item.timezone
          .toLocaleLowerCase()
          .includes(timezonesSearchQuery.toLocaleLowerCase())
      );
    }
  }, [timezonesSearchQuery, timezones]);

  return (
    <RNModal
      animationType="fade"
      onRequestClose={() => {
        onClose();
      }}
      visible={visible}
      transparent
    >
      <VStack className="flex-1 items-center justify-center bg-black/50">
        <VStack className="w-[90%] h-[75%] bg-white rounded-lg p-4">
          <HStack className="w-full justify-between items-center mb-4">
            <Heading size="md" className="text-typography-950">
              Select slot timezone
            </Heading>
            <Button
              onPress={() => {
                onClose();
              }}
              variant="outline"
              size="sm"
              className="rounded-full p-3.5"
            >
              <ButtonIcon as={CloseIcon} />
            </Button>
          </HStack>
          <Input size="lg" className="mb-4">
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField
              placeholder="Search timezones"
              value={timezonesSearchQuery}
              onChangeText={(enteredText) => {
                setTimezonesSearchQuery(enteredText);
              }}
            />
          </Input>
          <RadioGroup
            value={selectedTimezone}
            onChange={(v) => {
              onChangeTimezone(v);
            }}
            className="flex flex-1"
          >
            <FlatList
              contentContainerClassName="grow gap-2"
              ListEmptyComponent={() => (
                <Center className="flex flex-1">
                  {loading ? (
                    <Spinner size={"large"} />
                  ) : (
                    <Text>There is no avilable slots for this timezone</Text>
                  )}
                </Center>
              )}
              className="flex flex-1"
              initialNumToRender={20}
              data={filteredTimezones}
              keyExtractor={(item) => item.timezone}
              renderItem={({ item }) => (
                <Radio
                  value={item.timezone}
                  size="md"
                  isInvalid={false}
                  isDisabled={false}
                >
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel>
                    {item.timezone} - {item.offset}
                  </RadioLabel>
                </Radio>
              )}
            />
          </RadioGroup>
          <HStack className="justify-end items-center mt-4" space="sm">
            <Button
              size="md"
              variant="outline"
              action="primary"
              onPress={handleReset}
            >
              <ButtonText>Reset!</ButtonText>
            </Button>
            <Button
              size="md"
              variant="solid"
              action="primary"
              onPress={handleClose}
            >
              <ButtonText>Done!</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </RNModal>
  );
};

const styles = StyleSheet.create({});

export default TimezoneSelectionModal;
