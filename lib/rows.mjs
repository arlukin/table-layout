import arrayify from 'array-back/index.mjs'
import Cell from './cell.mjs'
import t from 'typical/index.mjs'

/**
 *
 */
class Rows {
  constructor (rows, columns) {
    this.list = []
    this.load(rows, columns)
  }

  load (rows, columns) {
    arrayify(rows).forEach(row => {
      this.list.push(new Map(objectToIterable(row, columns)))
    })
  }

  static removeEmptyColumns (data) {
    const distinctColumnNames = data.reduce((columnNames, row) => {
      Object.keys(row).forEach(key => {
        if (columnNames.indexOf(key) === -1) columnNames.push(key)
      })
      return columnNames
    }, [])

    const emptyColumns = distinctColumnNames.filter(columnName => {
      const hasValue = data.some(row => {
        const value = row[columnName]
        return (t.isDefined(value) && typeof value !== 'string') || (typeof value === 'string' && /\S+/.test(value))
      })
      return !hasValue
    })

    return data.map(row => {
      emptyColumns.forEach(emptyCol => delete row[emptyCol])
      return row
    })
  }
}

function objectToIterable (row, columns) {
  return columns.list.map(column => {
    return [column, new Cell(row[column.name], column)]
  })
}

/**
 * @module rows
 */
export default Rows
