import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import DateTimePicker, {
  IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { useFormik } from "formik";
import { slotsFilteringScheme, SlotsFilterValues } from "./schemes";
import moment from "moment-timezone";
import { HStack } from "@/components/ui/hstack";
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
import { AlertCircleIcon } from "lucide-react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "@/components/ui/actionsheet";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  createDateTime,
  getCurrentTimezone,
} from "@/utils/helpers/dateTimeHelpers";
import { Heading } from "@/components/ui/heading";

type PickerMode = IOSNativeProps["mode"];
type Props = {
  onSubmitFilteringForm: (values: SlotsFilterValues) => void;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
};
const SlotsFilteringForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmitFilteringForm,
  onReset,
}) => {
  const [pickerMode, setPickerMode] = useState<PickerMode>("date");
  const [showPicker, setShowPicker] = useState(false);
  const [dateTimePickerIdentifier, setDateTimePickerIdentifier] = useState<
    "start" | "end"
  >("start");
  const {
    handleChange,
    handleSubmit,
    errors,
    values,
    setFieldTouched,
    setFieldValue,
    touched,
    resetForm,
  } = useFormik<SlotsFilterValues>({
    validationSchema: slotsFilteringScheme,
    onSubmit(values, formikHelpers) {
      onSubmitFilteringForm(values);
    },
    onReset(values, formikHelpers) {
      onReset();
    },
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      endDate: "",
      endTime: "",
      startDate: moment().format("YYYY-MM-DD"),
      startTime: moment().format("HH:mm"),
    },
  });
  const handleReset = () => {
    resetForm();
  };

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

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="">
          <ActionsheetScrollView>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <VStack className="w-full" space="md">
              {/* filter form header */}

              <Heading size="xl" className="font-semibold">
                Filter slots
              </Heading>

              {/* Filter form start date and time HStack */}

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
                    <FormControlHelperText>
                      Slot filter start date
                    </FormControlHelperText>
                  </FormControlHelper>
                  {errors.startDate && touched.startDate && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {errors.startDate}
                      </FormControlErrorText>
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
                    <FormControlHelperText>
                      Slot filter start time
                    </FormControlHelperText>
                  </FormControlHelper>
                  {errors.startTime && touched.startTime && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {errors.startTime}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </HStack>
              {/* Filter form end date and time HStack */}

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
                    <FormControlHelperText>
                      Slot filter end date
                    </FormControlHelperText>
                  </FormControlHelper>
                  {errors.endDate && touched.endDate && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {errors.endDate}
                      </FormControlErrorText>
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
                    <FormControlHelperText>
                      Slot filter end time
                    </FormControlHelperText>
                  </FormControlHelper>
                  {errors.endTime && touched.endTime && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {errors.endTime}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </HStack>
              {/* Filtering form footer */}
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
                  <ButtonText>Filter</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ActionsheetScrollView>
        </ActionsheetContent>
      </Actionsheet>
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
    </>
  );
};

const styles = StyleSheet.create({});

export default SlotsFilteringForm;
