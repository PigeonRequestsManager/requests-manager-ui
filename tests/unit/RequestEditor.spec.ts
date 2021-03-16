import { shallowMount } from '@vue/test-utils'
import RequestEditor from 'views/RequestEditor/RequestEditor.vue'

import type { Request } from 'components/sharedInterfaces'
import { EditorsArray } from 'components/sharedEnums'

describe('RequestEditor.vue', () => {
  const request: Request = {
    _id: 0,
    endpoint: 'http://192.168.1.1/api/endpoint',
    headers: { 'Content-Type': 'application/json' },
    method: 'GET'
  }

  test('Renders proper JSON in editor with content of Request.headers at start', () => {
    const wrapper = shallowMount(RequestEditor, {
      props: { request }
    })
    expect(wrapper.vm.editedJson).toEqual(request.headers)
  })

  test.each(EditorsArray)('Renders proper JSON in editor for request[%p] after clicking on corresponding button', (editorName) => {
    const wrapper = shallowMount(RequestEditor, {
      props: { request }
    })
  // TODO: find select with editorName and check if editor value changed correctly
  // wrapper.vm.find('select').simulate('change', { target: { value: editorName } })
  // expect(wrapper.vm.editedJson).toEqual(request[editorName])
  })
})
