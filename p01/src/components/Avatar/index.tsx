import styles from './styles.module.css';

interface AvatarProps {
  hasBorder: boolean;
  src: string;
}

export function Avatar({hasBorder, src}: AvatarProps) {
  return(
    <img className={hasBorder ? styles.avatar : styles.avatarBorderless} src={src}/>
  )
}