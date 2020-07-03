import React from 'react'

// A high order component that creates a blotter text component using the input parameters
export const createBlotterComponent = ({
                                           // A material is a function that returns a shader string and uniforms to update the effects
                                           material,
                                           // setMaterialValues is a function that takes a shader material and input props, and updates the materials with those props
                                           // This is invoked on first mount and subsequent state updates
                                           setMaterialValues,
                                           // Default props of the component
                                           defaultProps,
                                           // Component's display name (useful for debugging)
                                           displayName,
                                       }) => {
    class BlotterComponent extends React.Component {
        static displayName = displayName
        static defaultProps = defaultProps
        material = null

        updateBlotter() {
            const BlotterInstance = window.Blotter
            const {shader, uniforms} = material(BlotterInstance)

            this.material = new BlotterInstance.ShaderMaterial(shader, {uniforms})

            // Create a text object with style properties
            const text = new BlotterInstance.Text(this.props.text, {
                family: this.props.fontFamily,
                size: this.props.fontSize,
                fill: this.props.fill,
                paddingLeft: this.props.paddingLeft,
                paddingRight: this.props.paddingRight,
                paddingBottom: this.props.paddingBottom,
                paddingTop: this.props.paddingTop,
                leading: this.props.lineHeight,
                weight: this.props.fontWeight,
                style: this.props.fontStyle,
            })

            const textObj = new Blotter(this.material, {texts: text}).forText(text)

            const element = document.getElementById(this.props.id)
            while (element.lastChild) {
                element.removeChild(element.lastChild);
            }
            textObj.appendTo(element)

            setMaterialValues(this.material, this.props)
        }

        componentDidMount() {
            this.updateBlotter()
        }

        componentDidUpdate() {
            this.updateBlotter()
        }

        shouldComponentUpdate(nextProps) {
            return (nextProps.text !== this.props.text)
        }

        render() {
            return <div id={this.props.id} style={this.props.wrapperStyles}/>
        }
    }

    return BlotterComponent
}
