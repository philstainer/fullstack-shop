import PropTypes from 'prop-types'

import StyledTabs from '#root/components/styles/StyledTabs'

const Tabs = ({activeIndex, tabs}) => {
  const [activeTab, setActiveTab] = React.useState(activeIndex)

  const renderTabs = tabs.map((tab, index) => (
    <li
      key={index}
      onClick={() => setActiveTab(index)}
      className={index === activeTab ? 'active' : ''}
    >
      {tab.text}
    </li>
  ))

  const renderTab = tabs[activeTab]?.component

  return (
    <StyledTabs>
      <ul>{renderTabs}</ul>
      <div>{renderTab}</div>
    </StyledTabs>
  )
}

Tabs.defaultProps = {
  activeIndex: 0,
}

Tabs.propTypes = {
  activeIndex: PropTypes.number,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      component: PropTypes.node.isRequired,
    }).isRequired,
  ).isRequired,
}

export default Tabs
