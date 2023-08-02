import classnames from 'classnames';
import styles from './styles.module.scss';

export type FlexBoxProps = {
  children?: React.ReactNode;
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end';
  align?: 'start' | 'center' | 'end';
  gap?: string | number;
};

function FlexBox({ direction = 'column', children = undefined, justify = 'center', align = 'center', gap}: FlexBoxProps) {
  const flexStyles = classnames(styles.flexBox, styles[direction], styles[`justify-${justify}`], styles[`align-${align}`]);

  return (
    <div className={flexStyles} style={{ gap }}>
      {children}
    </div>
  )
}

export { FlexBox };