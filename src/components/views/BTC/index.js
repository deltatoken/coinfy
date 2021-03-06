import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'

import { setHref } from '/store/actions'
import styles from '/const/styles'

import { BTC } from '/api/coins'
import { routes, Router, Route, Show } from '/store/router'
import state from '/store/state'
import {
    isAssetWithPrivateKeyOrSeed,
    getParamsFromLocation,
    getRouteFromLocation
} from '/store/getters'

import Help from '/components/styled/Help'
import Select from '/components/styled/Select'
import Div from '/components/styled/Div'
import Message from '/components/styled/Message'
import {
    RightContainerPadding,
    RightContainerMiddle2,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import {
    Menu,
    MenuContentItem,
    MenuContentItemText
} from '/components/styled/Menu'

import HeaderAsset from '/components/partials/HeaderAsset'
import Summary from '/components/views/BTC/Summary'
import Send from '/components/views/BTC/Send'
import ChangePassword from '/components/views/BTC/ChangePassword'
import ExportBTC from '/components/views/BTC/Export'
import Delete from '/components/views/BTC/Delete'

export default class ViewBTC extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.location, 'pathname')
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onClick(route) {
        setHref(route(getParamsFromLocation()))
    }

    render() {
        const { asset_id } = getParamsFromLocation()
        const hasPrivateKey = isAssetWithPrivateKeyOrSeed(asset_id)
        return React.createElement(ViewBTCTemplate, {
            location: state.location,
            route: getRouteFromLocation(),
            hasPrivateKey: hasPrivateKey,
            onClick: this.onClick
        })
    }
}

function ViewBTCTemplate({ location, route, hasPrivateKey, onClick }) {
    const tooltipPrivatekey = hasPrivateKey ? null : (
        <HideMobile>
            <Help position="center" width={175}>
                This wallet does not have private key
            </Help>
        </HideMobile>
    )
    return (
        <RightContainerPadding>
            <HeaderAsset />
            <RightContent>
                <Div margin-bottom={styles.paddingContent}>
                    <Menu>
                        <MenuContentItem
                            selected={route === routes.asset}
                            onClick={e => onClick(routes.asset)}
                        >
                            <MenuContentItemText>Summary</MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={route === routes.assetSend}
                            onClick={e => {
                                if (hasPrivateKey) onClick(routes.assetSend)
                            }}
                        >
                            <MenuContentItemText>
                                Send{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={route === routes.assetExport}
                            onClick={e => {
                                if (hasPrivateKey) onClick(routes.assetExport)
                            }}
                        >
                            <MenuContentItemText>
                                Paper Wallet{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={route === routes.assetChangepassword}
                            onClick={e => {
                                if (hasPrivateKey)
                                    onClick(routes.assetChangepassword)
                            }}
                        >
                            <MenuContentItemText>
                                Change password{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            selected={route === routes.assetDelete}
                            onClick={e => onClick(routes.assetDelete)}
                        >
                            <MenuContentItemText>Delete</MenuContentItemText>
                        </MenuContentItem>
                    </Menu>
                </Div>

                <Router>
                    <Route is={routes.asset}>
                        <Summary />
                    </Route>

                    <Route is={routes.assetSend}>
                        <Send />
                    </Route>

                    <Route is={routes.assetChangepassword} if={hasPrivateKey}>
                        <ChangePassword />
                    </Route>

                    <Route is={routes.assetExport} if={hasPrivateKey}>
                        <ExportBTC />
                    </Route>

                    <Route is={routes.assetDelete}>
                        <Delete />
                    </Route>

                    <Route>
                        <RightContainerMiddle2>
                            <Message>Not found</Message>
                        </RightContainerMiddle2>
                    </Route>
                </Router>
            </RightContent>
        </RightContainerPadding>
    )
}

const HideMobile = styled.span`
    ${styles.media.second} {
        display: none;
    }
`
