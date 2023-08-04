import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useFormSchema, useFormValues } from "../../../utils/hooks";
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";

interface IProps {
	id: string;
	schema: TFrontendEngineFieldSchema;
	Field: React.ComponentType<any>;
}

export const FieldWrapper = ({ Field, id, schema }: IProps) => {
	const { control, setValue } = useFormContext();

	const {
		formSchema: { defaultValues, restoreMode },
	} = useFormSchema();
	const { getField, setField } = useFormValues();

	useEffect(() => {
		setValue(id, getField(id));

		return () => {
			if (restoreMode === "default-value") {
				setField(id, defaultValues?.[id]);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// =========================================================================
	// RENDER
	// =========================================================================
	return (
		<Controller
			control={control}
			name={id}
			shouldUnregister={true}
			render={({ field, fieldState }) => {
				const fieldProps = {
					...field,
					id,
					value: getField(id),
					ref: undefined, // not passing ref because not all components have fields to be manipulated
				};
				return <Field schema={schema} {...fieldProps} {...fieldState} />;
			}}
		/>
	);
};
