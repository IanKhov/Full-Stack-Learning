const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('Check list_helper', () => {
    test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
    })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favourite blog', () => {
  const listWithtwoBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }, 
    {
      _id: '5a422aa71b54a676234d23131',
      title: 'How to fish in a River',
      author: 'Bob Martin',
      url: 'Some random URL',
      likes: 9,
      __v: 1
    }
  ]

  test('when list has only two blogs, test which blog has the higher likes', () => {
    const result = listHelper.favouriteBlog(listWithtwoBlogs)
    const answer = {
      _id: '5a422aa71b54a676234d23131',
      title: 'How to fish in a River',
      author: 'Bob Martin',
      url: 'Some random URL',
      likes: 9,
      __v: 1
    }

    assert.deepStrictEqual(result, answer)
  })
})