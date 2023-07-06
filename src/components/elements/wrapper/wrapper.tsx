import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import React, { Fragment, ReactNode, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as FrontendEngineElements from "..";
import { ObjectHelper, TestHelper } from "../../../utils";
import { useFormSchema } from "../../../utils/hooks";
import * as FrontendEngineCustomComponents from "../../custom";
import * as FrontendEngineFields from "../../fields";
import {
	ECustomElementType,
	ECustomFieldType,
	EElementType,
	EFieldType,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
} from "../../frontend-engine/types";
import { ERROR_MESSAGES } from "../../shared";
import { ConditionalRenderer } from "./conditional-renderer";
import { IWrapperProps, IWrapperSchema } from "./types";
import { DSAlert } from "./wrapper.styles";

const fieldTypeKeys = Object.keys(EFieldType);
const elementTypeKeys = Object.keys(EElementType);

export const Wrapper = (props: IWrapperProps): JSX.Element | null => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema, children, warnings } = props;
	const { showIf, uiType, children: schemaChildren, ...otherSchema } = schema || {};
	const [components, setComponents] = useState<React.ReactNode>(null);
	const { control } = useFormContext();
	const {
		formSchema: { overrides },
	} = useFormSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	/**
	 * render direct descendants according to the type of children
	 * - conditionally render components through Controller
	 * - render strings directly
	 * - otherwise show field not supported error
	 */
	useDeepCompareEffect(() => {
		const wrapperChildren = overrideSchema(schemaChildren || children, overrides);
		if (typeof wrapperChildren === "object") {
			const renderComponents: JSX.Element[] = [];

			Object.keys(wrapperChildren).forEach((childId) => {
				const childSchema = wrapperChildren[childId];
				if (isEmpty(childSchema) || typeof childSchema !== "object") return;
				let renderComponent: ReactNode = (
					<Fragment key={childId}>{ERROR_MESSAGES.GENERIC.UNSUPPORTED}</Fragment>
				);
				if ("referenceKey" in childSchema) {
					const referenceKey = childSchema.referenceKey.toUpperCase();
					if (FrontendEngineCustomComponents[ECustomFieldType[referenceKey]]) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildField);
					} else if (FrontendEngineCustomComponents[ECustomElementType[referenceKey]]) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildElement);
					} else {
						// let custom components fail silently
						renderComponent = <></>;
					}
				} else if ("uiType" in childSchema) {
					if (fieldTypeKeys.includes(childSchema.uiType.toUpperCase())) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildField);
					} else if (elementTypeKeys.includes(childSchema.uiType.toUpperCase())) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildElement);
					}
				}
				renderComponents.push(renderComponent);
			});
			setComponents(renderComponents);
		} else if (typeof wrapperChildren === "string") {
			setComponents(wrapperChildren);
		} else {
			setComponents(ERROR_MESSAGES.GENERIC.UNSUPPORTED);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schemaChildren || children, overrides, control, warnings]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const overrideSchema = (children: IWrapperSchema["children"], overrides: IFrontendEngineData["overrides"]) => {
		if (isEmpty(overrides) || typeof children === "string") return children;

		let filteredOverrides = {};
		Object.keys(children).forEach((childId) => {
			const overrideEntry = ObjectHelper.getNestedValueByKey(overrides, childId);
			if (!isEmpty(overrideEntry)) {
				filteredOverrides = { ...filteredOverrides, ...overrideEntry };
			}
		});

		if (!isEmpty(filteredOverrides)) {
			return merge(children, filteredOverrides);
		}

		return children;
	};

	const buildConditionalRenderer =
		(childId: string, childSchema: TFrontendEngineFieldSchema) =>
		(buildFn: (childId: string, child: TFrontendEngineFieldSchema) => JSX.Element) =>
			(
				<ConditionalRenderer
					id={childId}
					key={childId}
					{...(childSchema && "showIf" in childSchema && { renderRules: childSchema.showIf })}
					schema={childSchema}
				>
					{buildFn(childId, childSchema)}
				</ConditionalRenderer>
			);

	const buildField = (childId: string, childSchema: TFrontendEngineFieldSchema) => {
		let Field;
		if ("uiType" in childSchema) {
			Field = FrontendEngineFields[EFieldType[childSchema.uiType?.toUpperCase()]];
		} else if ("referenceKey" in childSchema) {
			Field = FrontendEngineCustomComponents[ECustomFieldType[childSchema.referenceKey?.toUpperCase()]];
		}

		if (!Field) return null;
		return (
			<Controller
				control={control}
				name={childId}
				shouldUnregister={true}
				render={({ field, fieldState }) => {
					const fieldProps = { ...field, id: childId, ref: undefined }; // not passing ref because not all components have fields to be manipulated
					const warning = warnings?.[childId];
					return (
						<>
							<Field schema={childSchema} {...fieldProps} {...fieldState} />
							{warning && <DSAlert type="warning">{warning}</DSAlert>}
						</>
					);
				}}
			/>
		);
	};

	const buildElement = (childId: string, childSchema: TFrontendEngineFieldSchema) => {
		let Element;
		if ("uiType" in childSchema) {
			Element = FrontendEngineElements[EElementType[childSchema.uiType?.toUpperCase()]] || Wrapper;
		} else if ("referenceKey" in childSchema) {
			Element = FrontendEngineCustomComponents[ECustomElementType[childSchema.referenceKey?.toUpperCase()]];
		}
		return <Element schema={childSchema} id={childId} />;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const Component = uiType as string | React.FunctionComponent;

	if (!Component) {
		return <>{components}</>;
	}
	return (
		<Component {...otherSchema} {...{ id, "data-testid": TestHelper.generateId(id, uiType) }}>
			{components}
		</Component>
	);
};
