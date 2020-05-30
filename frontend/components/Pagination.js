import {useQuery} from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Link from 'next/link'

import ITEMS_CONNECTION_QUERY from '#root/graphql/itemsConnection.query'
import StyledPagination from '#root/components/styles/StyledPagination'

const perPage = 4

const Items = ({page}) => {
  const {data, loading, error} = useQuery(ITEMS_CONNECTION_QUERY)

  const count = data?.itemsConnection?.totalCount
  const pages = Math.ceil(count / perPage)

  if (loading) return <p>Loading...</p>
  if (error)
    return (
      <p>
        Error:
        {error.message}
      </p>
    )

  return (
    <div style={{textAlign: 'center'}}>
      <StyledPagination data-testid="pagination">
        <Head>
          <title>
            Fullstack shop! - Page {page} of {pages}
          </title>
        </Head>

        <Link href={{pathname: '/', query: {page: page - 1}}}>
          <a className="prev" aria-disabled={page <= 1}>
            ← Prev
          </a>
        </Link>

        <p>
          Page {page} of <span className="totalPages">{pages}</span>!
        </p>

        <p>
          {count} Item{count > 1 && 's'} Total
        </p>

        <Link href={{pathname: '/', query: {page: page + 1}}}>
          <a className="next" aria-disabled={page >= pages}>
            Next →
          </a>
        </Link>
      </StyledPagination>
    </div>
  )
}

Items.propTypes = {
  page: PropTypes.number.isRequired,
}

export default Items
