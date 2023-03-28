import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ISelectSchema } from "../../../components/fields";
import { CommonFieldStoryProps, StyledForm, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Select",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Select</Title>
					<Description>This component provides a set of options for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("select"),
		disabled: {
			description: "Specifies if the input should be disabled",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		options: {
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "{ label: string, value: string }[]",
				},
			},
			type: { name: "object", value: {} },
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		listStyleWidth: {
			description: "Style option: The width of the options. You can specify e.g. 100% or 12rem",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
	},
} as Meta;

const Template: Story<Record<string, ISelectSchema>> = (args) => (
	<StyledForm
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SubmitButtonStorybook,
					},
				},
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"select-default": {
		uiType: "select",
		label: "Fruits",
		options: [
			{ label: "1", value: "1" },
			{ label: "2", value: "2" },
			{ label: "3", value: "3" },
		],
	},
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						"select-default-value": {
							uiType: "select",
							label: "Fruits",
							options: [
								{ label: "Apple", value: "apple" },
								{ label: "Berry", value: "berry" },
								{ label: "Cherry", value: "cherry" },
							],
						},
						...SubmitButtonStorybook,
					},
				},
			},
			defaultValues: { "select-default-value": "apple" },
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"select-disabled": {
		uiType: "select",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
		disabled: true,
	},
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	"select-custom-width": {
		uiType: "select",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
		listStyleWidth: "12rem",
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"select-placeholder": {
		uiType: "select",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
		placeholder: "Select your fruit",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"select-with-validation": {
		uiType: "select",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
		validation: [{ required: true }],
	},
};
