const assert = require('chai').assert;
const filters = require('../app.js');

describe('Filters scores through different criteria', () => {
  describe('#getSubmissionsByStudent', () => {
    it('should accept an array of student submissions and a student id number and return all submission that match the id number', () => {
      assert.deepEqual(filters.getSubmissionsByStudent([{
        studentId: 1
      }, {
        studentId: 1
      }, {
        studentId: 2
      }], 1), [{
        studentId: 1
      }, {
        studentId: 1
      }])
    })
    it('should return an empty array if no student matches the id number passed in', () => {
      assert.deepEqual(filters.getSubmissionsByStudent([{
        studentId: 1
      }, {
        studentId: 1
      }, {
        studentId: 2
      }], 3), [])
    })
  })
  describe('#getPassedSubmissions', () => {
    it('returns an array of passed submissions based on the student', () => {
      assert.deepEqual(filters.getPassedSubmissions([{
        studentId: 1,
        didPass: true
      }, {
        studentId: 1,
        didPass: false
      }, {
        studentId: 2,
        didPass: true
      }]), [{
        studentId: 1,
        didPass: true
      }, {
        studentId: 2,
        didPass: true
      }])
    })
  })
  describe('#getFailedSubmissions', () => {
    it('returns an array of failed submissions based on the student', () => {
      assert.deepEqual(filters.getFailedSubmissions([{
        studentId: 1,
        didPass: true
      }, {
        studentId: 1,
        didPass: false
      }, {
        studentId: 2,
        didPass: true
      }]), [{
        studentId: 1,
        didPass: false
      }])
    })
  })
})
