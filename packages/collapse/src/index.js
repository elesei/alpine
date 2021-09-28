export default function (Alpine) {
    Alpine.directive('collapse', (el, { expression, modifiers }, { effect, evaluateLater }) => {
        let duration = modifierValue(modifiers, 'duration', 250) / 1000
        let floor = 0

        el.style.overflow = 'hidden'
        if (! el._x_isShown) el.style.height = `${floor}px`
        if (! el._x_isShown) el.style.removeProperty('display')

        // Override the setStyles function with one that won't
        // revert updates to the height style.
        let setFunction = (el, styles) => {
            let revertFunction = Alpine.setStyles(el, styles);

           return styles.height ? () => {} : revertFunction
        }

        let transitionStyles = {
            overflow: 'hidden',
            transitionProperty: 'height',
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        el._x_transition = {
            in(before = () => {}, after = () => {}) {
                let current = el.getBoundingClientRect().height

                Alpine.setStyles(el, {
                    height: 'auto'
                })

                let full = el.getBoundingClientRect().height

                if (current === full) { current = floor }
                
                Alpine.transition(el, Alpine.setStyles, {
                    during: transitionStyles,
                    start: { height: current+'px' },
                    end: { height: full+'px' },
                }, () => el._x_isShown = true, () => {})
            },
    
            out(before = () => {}, after = () => {}) {
                let full = el.getBoundingClientRect().height

                Alpine.transition(el, setFunction, {
                    during: transitionStyles,
                    start: { height: full+'px' },
                    end: { height: floor+'px' },
                }, () => {}, () => el._x_isShown = false)
            },
        }
    })
}
