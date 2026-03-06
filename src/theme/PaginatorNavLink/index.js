import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

export default function PaginatorNavLink(props) {
  const {
    permalink,
    title,
    subLabel,
    isNext,
    isDisabled = false,
    className,
    onClick,
    ...rest
  } = props;

  const classes = clsx(
    'pagination-nav__link',
    isNext ? 'pagination-nav__link--next' : 'pagination-nav__link--prev',
    className,
    isDisabled ? 'sl-paginatorLinkDisabled' : null,
  );

  if (isDisabled) {
    return (
      <span className={classes} aria-disabled="true" {...rest}>
        {subLabel ? <div className="pagination-nav__sublabel">{subLabel}</div> : null}
        <div className="pagination-nav__label">{title}</div>
      </span>
    );
  }

  return (
    <Link
      className={classes}
      to={permalink}
      onClick={onClick}
      {...rest}
    >
      {subLabel ? <div className="pagination-nav__sublabel">{subLabel}</div> : null}
      <div className="pagination-nav__label">{title}</div>
    </Link>
  );
}
