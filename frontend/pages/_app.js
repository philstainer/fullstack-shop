/* eslint-disable react/jsx-props-no-spreading */

import App from 'next/app'
import React from 'react'
import {ApolloProvider} from '@apollo/react-hooks'

import withData from '#root/utils/apolloClient'
import Page from '#root/components/Page'

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // this exposes the query to the user
    pageProps.query = ctx.query
    return {pageProps}
  }

  render() {
    const {Component, apollo, pageProps} = this.props
    return (
      <ApolloProvider client={apollo}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    )
  }
}

export default withData(MyApp)
