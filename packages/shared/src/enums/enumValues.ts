const enumValues = <T extends { [index: string]: string | number }>(input: T) => {
    return Object.keys(input).map((key) => input[key as any])
}

export {enumValues}
