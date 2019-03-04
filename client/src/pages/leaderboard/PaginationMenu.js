import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu } from 'semantic-ui-react';
import getUniqueKey from '../../utils/unique_key';

const PaginationMenu = ({
  pageCount, backNavigation, forwardNavigation, currentPage, setPage,
}) => {
  const nextPage = () => {
    if (currentPage < pageCount) {
      setPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };
  return (
    <Menu pagination>
      <Menu.Item as="a" icon disabled={!backNavigation} onClick={prevPage}>
        <Icon name="chevron left" />
      </Menu.Item>
      {[...new Array(pageCount)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <Menu.Item
            key={getUniqueKey({})}
            as="a"
            active={currentPage === pageNumber}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </Menu.Item>
        );
      })}
      <Menu.Item as="a" icon disabled={!forwardNavigation} onClick={nextPage}>
        <Icon name="chevron right" />
      </Menu.Item>
    </Menu>
  );
};

PaginationMenu.propTypes = {
  pageCount: PropTypes.number.isRequired,
  backNavigation: PropTypes.bool.isRequired,
  forwardNavigation: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default PaginationMenu;
