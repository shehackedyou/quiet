import React, { FC, useEffect, useRef } from 'react'
import { Grid, List, Typography, useTheme } from '@mui/material'
import {
  ContextMenuProps,
  ContextMenuHintProps,
  ContextMenuItemListProps,
  ContextMenuItemProps,
} from './ContextMenu.types'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

export const ContextMenu: FC<ContextMenuProps> = ({ visible, handleClose, handleBack, title, children }) => {
  const theme = useTheme()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (ref.current && !ref.current.contains(target)) {
        if (visible) {
          handleClose()
        }
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [ref])

  return (
    <Grid
      style={{
        display: visible ? 'flex' : 'none',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 9001,
        pointerEvents: 'none',
      }}
    >
      <Grid style={{ flex: 6 }} onClick={handleClose} />
      <Grid
        ref={ref}
        style={{
          flex: 4,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: theme.palette.background.default,
          boxShadow: theme.shadows[1],
          maxWidth: '375px',
          pointerEvents: 'auto',
        }}
        data-testid={'contextMenu'}
      >
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            textAlign: 'center',
            height: 60,
            width: '100%',
            borderBottom: `1px solid ${theme.palette.colors.border01}`,
          }}
        >
          <Grid
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            data-testid={`contextMenu-${title.split(' ').join('')}-backArrow`}
            onClick={handleBack || handleClose}
          >
            <NavigateBeforeIcon />
          </Grid>
          <Grid style={{ flex: 5, justifyContent: 'center' }}>
            <Typography fontSize={16} fontWeight={'medium'} style={{ alignSelf: 'center' }}>
              {title}
            </Typography>
          </Grid>
          <Grid style={{ flex: 1 }}></Grid>
        </Grid>
        {children}
      </Grid>
    </Grid>
  )
}

export const ContextMenuHint: FC<ContextMenuHintProps> = ({ hint }) => {
  const theme = useTheme()

  return (
    <Grid
      style={{
        width: '100%',
        padding: 16,
        borderTopWidth: 1,
        borderColor: theme.palette.colors.border01,
      }}
    >
      <Typography fontSize={14} fontWeight={'normal'}>
        {hint}
      </Typography>
    </Grid>
  )
}

export const ContextMenuItemList: FC<ContextMenuItemListProps> = ({ items }) => {
  return (
    <List
      style={{
        padding: 0,
        width: '100%',
      }}
    >
      {items.map((item, index) => {
        return <ContextMenuItem {...item} key={index} />
      })}
    </List>
  )
}

export const ContextMenuItem: FC<ContextMenuItemProps> = ({ title, action }) => {
  const theme = useTheme()

  return (
    <Grid
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '11px 16px',
        width: '100%',
        cursor: 'pointer',
        borderBottom: `1px solid ${theme.palette.colors.border01}`,
      }}
      onClick={action}
      data-testid={`contextMenuItem${title}`}
    >
      <Grid
        style={{
          flex: 8,
        }}
      >
        <Typography fontSize={16} fontWeight={'normal'}>
          {title}
        </Typography>
      </Grid>
      <Grid style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <NavigateNextIcon />
      </Grid>
    </Grid>
  )
}
