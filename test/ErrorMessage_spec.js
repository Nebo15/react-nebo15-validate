import React from 'react';
import { mount } from 'enzyme';

import ErrorMessages, { ErrorMessage } from '../src/ErrorMessages';

describe('ErrorMessages', () => {
  it('should render an error', () => {
    const el = mount(
      <ErrorMessages
        error={{
          required: true,
        }}
      />
    );
    expect(el.find('span').length).to.equal(1);
  });

  it('should not render if error object is empty', () => {
    const el = mount(
      <ErrorMessages
        error={{}}
      />
    );
    expect(el.find('span').length).to.equal(0);
  });

  it('should render children error if passed', () => {
    const el = mount(
      <ErrorMessages
        error={{
          required: true
        }}
      >
        <ErrorMessage when="required">Test required text</ErrorMessage>
      </ErrorMessages>
    );
    expect(el.find('span').at(0).text()).to.equal('Test required text');
  });

  it('should render nested html if passed', () => {
    const el = mount(
      <ErrorMessages
        error={{
          required: true
        }}
      >
        <ErrorMessage when="required" disableTemplateString>
          <a href="#">Test required text</a>
        </ErrorMessage>
      </ErrorMessages>
    );

    const renderedEl = el.find('div').at(0);
    const renderedNestedHtml = renderedEl.find('a').at(0);

    expect(renderedEl.type()).to.equal('div');
    expect(renderedNestedHtml.prop('href')).to.equal('#');
    expect(renderedNestedHtml.text()).to.equal('Test required text');
  });
});
