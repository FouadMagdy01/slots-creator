import { StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import DateTimePicker, {
  IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { useFormik } from "formik";
import { slotCreationSchema, SlotCreationValues } from "./schemes";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { createDateTime } from "@/utils/helpers/dateTimeHelpers";
import { AlertCircleIcon } from "@/components/ui/icon";
import moment from "moment-timezone";
import TimezoneSelectionModal from "../../modals/TimezoneSelectionModal";
import { useAppDispatch } from "@/redux-toolkit/store";
import useSlotsFormToast from "./completeionToastHook";
import { useRouter } from "expo-router";
import { generateSlotsFromSlotsForm } from "@/utils/soltsHelpers/slotsGenerationHelpers";
import { addGeneratedSlots } from "@/redux-toolkit/slices/slotsSlice";

type PickerMode = IOSNativeProps["mode"];

const CreateSlotsForm: React.FC = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [pickerMode, setPickerMode] = useState<PickerMode>("date");
  const [showPicker, setShowPicker] = useState(false);
  const [showTimezonesModal, setShowTimezonesModal] = useState(false);
  const [dateTimePickerIdentifier, setDateTimePickerIdentifier] = useState<
    "start" | "end"
  >("start");

  const navigateToViewSlots = () => {
    router.navigate("/viewSlots", {});
  };
  const { handleToast } = useSlotsFormToast({
    onClickView: navigateToViewSlots,
    title: "A new slots was generated",
    desc: "A new slots has been generated successfully",
    showButtons: true,
  });

  const {
    handleChange,
    handleSubmit,
    errors,
    values,
    setFieldTouched,
    setFieldValue,
    touched,
    resetForm,
  } = useFormik<SlotCreationValues>({
    validationSchema: slotCreationSchema,
    onSubmit(values, formikHelpers) {
      const generatedSlots = generateSlotsFromSlotsForm(values);
      dispatch(addGeneratedSlots(generatedSlots));
      handleToast();
      handleReset();
    },
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      breakDuration: "",
      bufferDuration: "",
      endDate: "",
      endTime: "",
      slotDuration: "",
      startDate: "",
      startTime: "",
      timeZone: "",
    },
  });

  const togglePickerVisibility = (pickerMode: PickerMode) => {
    setPickerMode(pickerMode);
    setShowPicker(!showPicker);
  };

  const datePickerValue = useMemo(() => {
    if (dateTimePickerIdentifier === "start") {
      return createDateTime(values.startDate, values.startTime);
    } else {
      return createDateTime(values.endDate, values.endTime);
    }
  }, [
    values.startDate,
    values.startTime,
    values.endDate,
    values.endTime,
    dateTimePickerIdentifier,
  ]);

  const handleReset = () => {
    resetForm();
  };

  return (
    <VStack className="flex flex-1 mt-4 w-[95%]" space="sm">
      {/* Timezone selection modal */}

      <TimezoneSelectionModal
        onReset={() => {
          handleChange("timeZone")("");
        }}
        onChangeTimezone={(v) => {
          handleChange("timeZone")(v);
          setFieldTouched("timeZone", true);
          setShowTimezonesModal(false);
        }}
        onClose={() => {
          setShowTimezonesModal(false);
        }}
        selectedTimezone={values.timeZone}
        visible={showTimezonesModal}
      />
      {/* Slot start date and time HStack */}

      <HStack className="w-full" space="sm">
        <FormControl
          className="flex flex-1"
          isInvalid={!!errors.startDate && touched.startDate}
        >
          <FormControlLabel>
            <FormControlLabelText>Start date</FormControlLabelText>
          </FormControlLabel>
          <Input size="lg">
            <InputField
              showSoftInputOnFocus={false}
              placeholder="YYYY-MM-DD"
              value={values.startDate}
              onPressIn={() => {
                setDateTimePickerIdentifier("start");
                togglePickerVisibility("date");
              }}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>Slot start date</FormControlHelperText>
          </FormControlHelper>
          {errors.startDate && touched.startDate && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.startDate}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <FormControl
          className="flex flex-1"
          isInvalid={!!errors.startTime && touched.startTime}
        >
          <FormControlLabel>
            <FormControlLabelText>Start time</FormControlLabelText>
          </FormControlLabel>
          <Input size="lg">
            <InputField
              showSoftInputOnFocus={false}
              placeholder="HH:mm"
              value={values.startTime}
              onPressIn={() => {
                setDateTimePickerIdentifier("start");
                togglePickerVisibility("time");
              }}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>Slot start time</FormControlHelperText>
          </FormControlHelper>
          {errors.startTime && touched.startTime && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.startTime}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </HStack>
      {/* Slot end date and time HStack */}

      <HStack className="w-full" space="sm">
        <FormControl
          className="flex flex-1"
          isInvalid={!!errors.endDate && touched.endDate}
        >
          <FormControlLabel>
            <FormControlLabelText>End date</FormControlLabelText>
          </FormControlLabel>
          <Input size="lg">
            <InputField
              showSoftInputOnFocus={false}
              placeholder="YYYY-MM-DD"
              value={values.endDate}
              onPressIn={() => {
                setDateTimePickerIdentifier("end");
                togglePickerVisibility("date");
              }}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>Slot end date</FormControlHelperText>
          </FormControlHelper>
          {errors.endDate && touched.endDate && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.endDate}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <FormControl
          className="flex flex-1"
          isInvalid={!!errors.endTime && touched.endTime}
        >
          <FormControlLabel>
            <FormControlLabelText>End time</FormControlLabelText>
          </FormControlLabel>
          <Input size="lg">
            <InputField
              showSoftInputOnFocus={false}
              placeholder="HH:mm"
              value={values.endTime}
              onPressIn={() => {
                setDateTimePickerIdentifier("end");
                togglePickerVisibility("time");
              }}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>Slot end time</FormControlHelperText>
          </FormControlHelper>
          {errors.endTime && touched.endTime && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.endTime}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </HStack>
      {/* Slot timezone input */}

      <FormControl
        className="w-full"
        isInvalid={!!errors.timeZone && touched.timeZone}
      >
        <FormControlLabel>
          <FormControlLabelText>Timezone</FormControlLabelText>
        </FormControlLabel>
        <Input className="w-full" size="lg">
          <InputField
            showSoftInputOnFocus={false}
            placeholder="Slot timezone"
            value={values.timeZone}
            onPressIn={() => {
              setFieldTouched("timeZone", true);
              setShowTimezonesModal(true);
            }}
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>Choose timezone</FormControlHelperText>
        </FormControlHelper>
        {errors.timeZone && touched.timeZone && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>{errors.timeZone}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      {/* Slot break duration input */}

      <FormControl
        className="w-full"
        isInvalid={!!errors.breakDuration && touched.breakDuration}
      >
        <FormControlLabel>
          <FormControlLabelText>Break duration</FormControlLabelText>
        </FormControlLabel>
        <Input className="w-full" size="lg">
          <InputField
            keyboardType="number-pad"
            placeholder="Break duration"
            value={values.breakDuration}
            onChangeText={(enteredText) => {
              setFieldValue("breakDuration", enteredText);
              setFieldTouched("breakDuration", true);
            }}
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>
            duration between slots in minutes
          </FormControlHelperText>
        </FormControlHelper>
        {errors.breakDuration && touched.breakDuration && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>{errors.breakDuration}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      {/* Slot buffer duration input */}

      <FormControl
        className="w-full"
        isInvalid={!!errors.bufferDuration && touched.bufferDuration}
      >
        <FormControlLabel>
          <FormControlLabelText>Buffer duration</FormControlLabelText>
        </FormControlLabel>
        <Input className="w-full" size="lg">
          <InputField
            keyboardType="number-pad"
            placeholder="Buffer duration"
            value={values.bufferDuration}
            onChangeText={(enteredText) => {
              setFieldValue("bufferDuration", enteredText);
              setFieldTouched("bufferDuration", true);
            }}
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>
            minimum duration for slot to be booked in minutes
          </FormControlHelperText>
        </FormControlHelper>
        {errors.bufferDuration && touched.bufferDuration && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>{errors.bufferDuration}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      {/* Slot duration input */}

      <FormControl
        className="w-full"
        isInvalid={!!errors.slotDuration && touched.slotDuration}
      >
        <FormControlLabel>
          <FormControlLabelText>Slot duration</FormControlLabelText>
        </FormControlLabel>
        <Input className="w-full" size="lg">
          <InputField
            keyboardType="number-pad"
            placeholder="Slot duration"
            value={values.slotDuration}
            onChangeText={(enteredText) => {
              setFieldValue("slotDuration", enteredText);
              setFieldTouched("slotDuration", true);
            }}
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>
            Slot duration in minutes
          </FormControlHelperText>
        </FormControlHelper>
        {errors.slotDuration && touched.slotDuration && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>{errors.slotDuration}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      {/* date and time */}
      {showPicker && (
        <DateTimePicker
          mode={pickerMode}
          value={datePickerValue}
          is24Hour
          onChange={(event, selectedDate) => {
            if (event.type == "set" && selectedDate) {
              if (dateTimePickerIdentifier == "start") {
                // Update startTime with selected time if in time mode
                if (pickerMode === "time") {
                  setFieldValue(
                    "startTime",
                    moment(selectedDate).format("HH:mm")
                  );
                  setFieldTouched("startTime", true);
                } else {
                  setFieldValue(
                    "startDate",
                    moment(selectedDate).format("YYYY-MM-DD")
                  );
                  setFieldTouched("startDate", true);
                }
              } else {
                // Update endTime with selected time if in time mode
                if (pickerMode === "time") {
                  setFieldValue(
                    "endTime",
                    moment(selectedDate).format("HH:mm")
                  );
                  setFieldTouched("endTime", true);
                } else {
                  setFieldValue(
                    "endDate",
                    moment(selectedDate).format("YYYY-MM-DD")
                  );
                  setFieldTouched("endDate", true);
                }
              }
            }
            setShowPicker(false);
          }}
          display="default"
        />
      )}

      {/* Form footer */}
      <HStack className="w-full justify-end mb-4" space="xs">
        <Button
          size="md"
          variant="outline"
          action="primary"
          onPress={handleReset}
        >
          <ButtonText>Reset</ButtonText>
        </Button>
        <Button
          onPress={() => {
            // Touch all fields to show validation errors
            Object.keys(values).forEach((key) => {
              setFieldTouched(key, true);
            });
            handleSubmit();
          }}
          size="md"
          variant="solid"
          action="primary"
        >
          <ButtonText>Add</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({});

export default CreateSlotsForm;
