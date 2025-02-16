import React from "react";
import {
    useNavigation,
    useTranslate,
    useCan,
    useResource,
    useRouterContext,
} from "@pankod/refine-core";
import {
    RefineCreateButtonProps,
    RefineButtonTestIds,
} from "@pankod/refine-ui-types";
import { Button, ButtonProps } from "@mantine/core";
import { SquarePlus, IconProps } from "tabler-icons-react";

export type CreateButtonProps = RefineCreateButtonProps<
    ButtonProps,
    {
        svgIconProps?: IconProps;
    }
>;

/**
 * <CreateButton> uses Material UI {@link https://mantine.dev/core/button/  `<Button> component`}.
 * It uses the {@link https://refine.dev/docs/core/hooks/navigation/useNavigation#create `create`} method from {@link https://refine.dev/docs/core/hooks/navigation/useNavigation `useNavigation`} under the hood.
 * It can be useful to redirect the app to the create page route of resource}.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/mantine/components/buttons/create-button} for more details.
 */
export const CreateButton: React.FC<CreateButtonProps> = ({
    resourceNameOrRouteName,
    hideText = false,
    ignoreAccessControlProvider = false,
    svgIconProps,
    children,
    onClick,
    ...rest
}) => {
    const { resource, resourceName } = useResource({
        resourceNameOrRouteName,
    });

    const { Link } = useRouterContext();
    const { createUrl: generateCreateUrl } = useNavigation();

    const translate = useTranslate();

    const { data } = useCan({
        resource: resourceName,
        action: "create",
        queryOptions: {
            enabled: !ignoreAccessControlProvider,
        },
        params: {
            resource,
        },
    });

    const disabledTitle = () => {
        if (data?.can) return "";
        else if (data?.reason) return data.reason;
        else
            return translate(
                "buttons.notAccessTitle",
                "You don't have permission to access",
            );
    };

    const createUrl = generateCreateUrl(resource.route!);

    const { sx, ...restProps } = rest;

    return (
        <Link
            to={createUrl}
            replace={false}
            onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
                if (onClick) {
                    e.preventDefault();
                    onClick(e);
                }
            }}
            style={{ textDecoration: "none" }}
        >
            <Button
                disabled={data?.can === false}
                leftIcon={!hideText && <SquarePlus {...svgIconProps} />}
                title={disabledTitle()}
                sx={{ minWidth: 0, ...sx }}
                data-testid={RefineButtonTestIds.CreateButton}
                {...restProps}
            >
                {hideText ? (
                    <SquarePlus fontSize="small" {...svgIconProps} />
                ) : (
                    children ?? translate("buttons.create", "Create")
                )}
            </Button>
        </Link>
    );
};
