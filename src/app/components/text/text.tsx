import ClassNameSingleton from '../../../utils/className';
import styles from './text.module.css'

interface TextProps {
    italic?: boolean;
    bold?: boolean;
    semibold?: boolean;
    className?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    text: string;
    style?: React.CSSProperties;
    white?: boolean;
    h1?: boolean;
    h2?: boolean;
}

export default function Text({
    italic,
    bold,
    semibold,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
    text,
    style,
    white,
    h1,
    h2,
}: TextProps) {
    return (
        <p 
            className={ClassNameSingleton.combine([
                styles.text,
                onClick ? styles.cursorPointer : "",
                italic ? styles.italic : "",
                semibold ? styles.semibold : "",
                bold ? styles.bold : "",
                white ? styles.white : "",
                h1 ? styles.h1 : "",
                h2 ? styles.h2 : "",
                className || ''
            ])} 
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={style}
        >
            {text}
        </p>
    )
}
