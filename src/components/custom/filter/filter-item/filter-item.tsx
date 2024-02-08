import { Filter } from "@lifesg/react-design-system/filter";
import { TestHelper } from "../../../../utils";
import { Wrapper } from "../../../elements/wrapper";
import { IGenericCustomElementProps } from "../../types";
import { IFilterItemSchema } from "./types";
import { useEffect, useState } from "react";

export const FilterItem = (props: IGenericCustomElementProps<IFilterItemSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		schema: { children, label, collapsible = true, showDivider = true, showMobileDivider = true, expanded = false },
	} = props;

	const [expandedState, setExpandedState] = useState(expanded);

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		setExpandedState(expanded);
	}, [expanded]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Filter.Item
			data-testid={TestHelper.generateId(id, "filter-item")}
			title={label}
			collapsible={collapsible}
			showDivider={showDivider}
			showMobileDivider={showMobileDivider}
			expanded={expandedState}
			onExpandChange={setExpandedState}
		>
			<Wrapper>{children}</Wrapper>
		</Filter.Item>
	);
};
