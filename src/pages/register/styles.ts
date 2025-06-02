import { Box, Heading, styled, Text } from '@ignite-ui/react'

export const Container = styled("main", {
    maxWidth: 540,
    margin: "$20 auto $4",
    padding: "0 $4",
})

export const Header = styled("div", {
    paddingBottom: "$6",
    borderBottom: "1px solid $gray600",

    [`> ${Heading}`]: {
        lineHeight: "$base",
    },

    [`> ${Text}`]: {
        color: "$gray200",
        marginBottom: "$6",
    }
})

export const Form = styled(Box, {
    marginTop: "$6",
    display: "flex",
    flexDirection: "column",
    gap: "$4",

    label: {
        display: "flex",
        flexDirection: "column",
        gap: "$2",
    }
})