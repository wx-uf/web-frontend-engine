import { Suspense, lazy, useState } from "react";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { StyledStaticMap } from "./location-field.styles";
import { LocationInput } from "./location-input/location-input";
import { ILocationInputSchema, ILocationInputValues } from "./types";

const LocationModal = lazy(() => import("./location-modal/location-modal"));

export const LocationField = (props: IGenericFieldProps<ILocationInputSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		schema: {
			label,
			locationInputPlaceholder,
			staticMapPinColor,
			mastheadHeight = 0,
			disableErrorPromptOnApp,
			mapPanZoom,
			interactiveMapPinIconUrl,
			reverseGeoCodeEndpoint,
			gettingCurrentLocationFetchMessage,
			mustHavePostalCode,
		},
		// form values can initially be undefined when passed in via props
		value: formValue,
		onChange,
	} = props;

	const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const updateFormValues = (updatedValues: ILocationInputValues) => {
		onChange?.({ target: { value: updatedValues } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<div id={id} data-testid={TestHelper.generateId(id)}>
			<LocationInput
				id={id}
				label={label}
				locationInputPlaceholder={locationInputPlaceholder}
				onChange={(e) => e.currentTarget.blur()}
				onFocus={(e) => {
					setShowLocationModal(true);
					e.currentTarget.blur();
				}}
				value={formValue?.address || ""}
			/>
			{!!formValue?.lat && !!formValue?.lng && (
				<StyledStaticMap
					id={id}
					lat={formValue.lat}
					lng={formValue.lng}
					staticMapPinColor={staticMapPinColor}
					onClick={() => setShowLocationModal(true)}
				/>
			)}
			<Suspense fallback={null}>
				{LocationModal && (
					<LocationModal
						id={id}
						mastheadHeight={mastheadHeight}
						showLocationModal={showLocationModal}
						onClose={() => setShowLocationModal(false)}
						formValues={formValue}
						onConfirm={updateFormValues}
						updateFormValues={updateFormValues}
						disableErrorPromptOnApp={disableErrorPromptOnApp}
						mapPanZoom={mapPanZoom}
						reverseGeoCodeEndpoint={reverseGeoCodeEndpoint}
						interactiveMapPinIconUrl={interactiveMapPinIconUrl}
						gettingCurrentLocationFetchMessage={gettingCurrentLocationFetchMessage}
						mustHavePostalCode={mustHavePostalCode}
					/>
				)}
			</Suspense>
		</div>
	);
};
