import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../common";
import { IFilterSchema } from "../../../components/custom/elements/filter/types";
import { IFilterItemCheckboxSchema } from "../../../components/custom/fields/filter-item-checkbox/types";

export default {
	title: "Custom/Filter",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Filter</Title>
					<Description>This component acts as a wrapper for filter component</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		label: { table: { disable: true } },
		referenceKey: {
			description: "Actual HTML element type to render the component as",
			table: {
				type: {
					summary: "filter",
				},
			},
			type: { name: "string", required: true },
			options: ["filter"],
			control: {
				type: "select",
			},
		},
		children: {
			description: "Elements or string that is the descendant of this component",
			table: {
				type: {
					summary: "TFrontendEngineFieldSchema | string | (string | TFrontendEngineFieldSchema)[]",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
	},
} as Meta;

const Template = (id: string) =>
	((args) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
						},
					},
				},
			}}
		/>
	)) as Story<IFilterSchema>; // TODO: should update type

const TemplateFilterItemCheckbox = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
						},
					},
				},
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as Story<IFilterSchema & { defaultValues?: string[] | undefined }>; // TODO: should update type

export const FilterWrapper = Template("wrapper-default").bind({});
FilterWrapper.args = {
	// uiType: "div",
	// children: {
	// 	name: {
	// 		label: "Filter Wrapper",
	// 		referenceKey: "filter",
	// 	},
	// },
};

export const FilterItem = Template("wrapper-default").bind({});
FilterItem.args = {
	referenceKey: "filter",
	children: {
		filterItem1: {
			label: "Filter Item 1",
			referenceKey: "filter-item",
			children: {
				dateField: {
					uiType: "date-field",
					label: "Date with default value",
					// defaultValues: "2022-02-01",
				},
			},
		},
	},
};

export const FilterCheckBoxItem = TemplateFilterItemCheckbox("checkbox-default-value").bind({});
FilterCheckBoxItem.args = {
	defaultValues: ["red"],
	referenceKey: "filter",
	children: {
		filterItem1: {
			label: "Filter Item 1",
			referenceKey: "filter-item-checkbox",
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
			defaultValues: ["red"],
			validation: [{ required: true }],
		},
	},
};
