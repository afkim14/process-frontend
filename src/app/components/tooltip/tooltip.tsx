import ClassNameSingleton from '../../../utils/className';
import Text from '../text/text';
import AnimatedDiv from '../animated/animatedDiv/animatedDiv';
import styles from './tooltip.module.css'

interface TooltipProps {
    className?: string;
    textClassName?: string;
    onClick?: (label: string) => void;
    style?: React.CSSProperties;
    labels: Array<string>;
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    alignLeft?: boolean;
    alignRight?: boolean;
    alignCenter?: boolean;
}

export default function Tooltip({
    className,
    textClassName,
    onClick,
    style,
    labels,
    top,
    right,
    bottom,
    left,
    alignRight,
    alignLeft,
    alignCenter
}: TooltipProps) {
    return (
        <AnimatedDiv
            className={ClassNameSingleton.combine([
                styles.tooltip,
                top ? styles.tooltipTop : '',
                right ? styles.tooltipRight : '',
                bottom ? styles.tooltipBottom : '',
                left ? styles.tooltipLeft : '',
                alignLeft ? styles.tooltipAlignLeft : '',
                alignRight ? styles.tooltipAlignRight : '',
                alignCenter ? styles.tooltipAlignCenter : '',
                className || ''
            ])}
            style={style}
        >
            {labels.map((label: string, index: number) => (
                <div 
                    key={`label-${index}`} className={styles.tooltipLabelContainer} 
                    onMouseDown={(): void => {
                        onClick && onClick(label) 
                    }}
                >
                    <Text
                        className={ClassNameSingleton.combine([
                            styles.tooltipLabelText,
                            textClassName || ''
                        ])}
                        text={label}
                        white
                    />
                </div>
            ))}
        </AnimatedDiv>
    )
}
