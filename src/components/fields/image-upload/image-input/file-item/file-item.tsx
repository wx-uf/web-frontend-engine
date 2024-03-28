import { Text } from "@lifesg/react-design-system/text";
import { CrossIcon } from "@lifesg/react-icons/cross";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileHelper, TestHelper } from "../../../../../utils";
import { ERROR_MESSAGES } from "../../../../shared";
import { EImageStatus, IImage, IImageUploadValidationRule, ISharedImageProps } from "../../types";
import {
	CellDeleteButton,
	CellFileSize,
	CellInfo,
	CellProgressBar,
	DeleteButton,
	ErrorText,
	MobileFileSize,
	ProgressBar,
	TextBody,
	Thumbnail,
	Wrapper,
} from "./file-item.styles";

interface IProps extends Omit<ISharedImageProps, "maxFiles"> {
	id?: string;
	index: number;
	fileItem: IImage;
	validation: IImageUploadValidationRule[];
	onDelete: (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FileItem = ({ id = "file-item", index, fileItem, maxSizeInKb, accepts, onDelete, validation }: IProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { dataURL, file, name: fileName, status, uploadProgress } = fileItem;
	const [isError, setError] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const fileNameWrapperRef = useRef<HTMLDivElement>(null);
	const [transformedFileName, setTransformedFileName] = useState<string>();
	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const setFileNameToWidth = useCallback(() => {
		let widthOfElement = 0;
		if (fileNameWrapperRef && fileNameWrapperRef.current) {
			widthOfElement = fileNameWrapperRef.current.getBoundingClientRect().width;
		}
		const transformed = FileHelper.truncateFileName(fileName, widthOfElement);
		setTransformedFileName(transformed);
	}, [fileName]);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		window.addEventListener("resize", setFileNameToWidth);
		return () => window.removeEventListener("resize", setFileNameToWidth);
	}, [setFileNameToWidth]);

	useEffect(() => {
		switch (status) {
			case EImageStatus.ERROR_FORMAT: {
				const fileTypeRule = validation?.find((rule) => "fileType" in rule);
				const _errorMessage = fileTypeRule?.errorMessage || ERROR_MESSAGES.UPLOAD("photo").FILE_TYPE(accepts);
				setError(true);
				setErrorMessage(_errorMessage);
				break;
			}
			case EImageStatus.ERROR_GENERIC:
				setError(true);
				setErrorMessage(ERROR_MESSAGES.UPLOAD("photo").GENERIC);
				break;
			case EImageStatus.ERROR_SIZE: {
				const fileSizeRule = validation?.find((rule) => "maxSizeInKb" in rule);
				const _errorMessage =
					fileSizeRule?.errorMessage || ERROR_MESSAGES.UPLOAD("photo").MAX_FILE_SIZE(maxSizeInKb);
				setError(true);
				setErrorMessage(_errorMessage);
				break;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, dataURL, file.type, maxSizeInKb]);

	useEffect(() => {
		setFileNameToWidth();
	}, [fileNameWrapperRef, setFileNameToWidth]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const fileSize = `${Math.round(
		FileHelper.getFilesizeFromBase64(fileItem.drawingDataURL || fileItem.dataURL || "") / 1000
	)} KB`;

	const renderError = () =>
		isError && (
			<ErrorText
				weight={"semibold"}
				id={TestHelper.generateId(`${id}-${index + 1}`, "error-text")}
				data-testid={TestHelper.generateId(`${id}-${index + 1}`, "error-text")}
			>
				{errorMessage}
			</ErrorText>
		);

	/**
	 * render progress bar or delete button
	 * - progress bar: no error or status = compressed / converted / uploading
	 * - delete button: got error or file is ready
	 */
	const renderDetails = () => {
		const renderProgressBar =
			!isError && [EImageStatus.COMPRESSED, EImageStatus.CONVERTED, EImageStatus.UPLOADING].includes(status);

		return renderProgressBar ? (
			<CellProgressBar>
				<ProgressBar value={uploadProgress} max={100} />
			</CellProgressBar>
		) : (
			<CellDeleteButton>
				<DeleteButton
					onClick={onDelete(index)}
					id={TestHelper.generateId(`${id}-${index + 1}`, "btn-delete")}
					data-testid={TestHelper.generateId(`${id}-${index + 1}`, "btn-delete")}
					aria-label={`remove ${fileName}`}
				>
					<CrossIcon />
				</DeleteButton>
			</CellDeleteButton>
		);
	};

	return (
		<Wrapper
			isError={isError}
			id={TestHelper.generateId(`${id}-${index + 1}`)}
			data-testid={TestHelper.generateId(`${id}-${index + 1}`)}
		>
			<>
				<CellInfo>
					{status === EImageStatus.UPLOADED && !isError && (
						<Thumbnail
							src={fileItem.dataURL ?? ""}
							id={TestHelper.generateId(`${id}-${index + 1}`, "image")}
							data-testid={TestHelper.generateId(`${id}-${index + 1}`, "image")}
						/>
					)}
					<TextBody
						as="div"
						id={TestHelper.generateId(`${id}-${index + 1}`, "file-image")}
						data-testid={TestHelper.generateId(`${id}-${index + 1}`, "file-image")}
						ref={fileNameWrapperRef}
					>
						{transformedFileName}
						<MobileFileSize>{fileSize}</MobileFileSize>
					</TextBody>
					{renderError()}
				</CellInfo>
				<CellFileSize>
					<Text.Body
						id={TestHelper.generateId(`${id}-${index + 1}`, "file-size")}
						data-testid={TestHelper.generateId(`${id}-${index + 1}`, "file-size")}
					>
						{fileSize}
					</Text.Body>
				</CellFileSize>
				{renderDetails()}
			</>
		</Wrapper>
	);
};
