import { formatNrr } from '../lib/standings'
import { cardClass } from '../lib/premiumStyles'
import Avatar from './Avatar'
import FormChips from './FormChips'

const headClass = 'px-2.5 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500'
const cellClass = 'px-2.5 py-3 text-center tabular-nums text-gray-700'

// The points table: position and team stay pinned on the left while the numbers scroll sideways on a phone
function PointsTable({ rows }) {
  const showNoResult = rows.some((row) => row.noResult > 0)
  const columns = [
    { key: 'played', label: 'P', title: 'Played' },
    { key: 'won', label: 'W', title: 'Won' },
    { key: 'lost', label: 'L', title: 'Lost' },
    { key: 'tied', label: 'T', title: 'Tied' },
    ...(showNoResult ? [{ key: 'noResult', label: 'NR', title: 'No result' }] : []),
  ]

  return (
    <div className={`${cardClass} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className={`${headClass} sticky left-0 z-10 bg-gray-50 text-left`}>
                Team
              </th>
              {columns.map((column) => (
                <th key={column.key} scope="col" title={column.title} className={headClass}>
                  {column.label}
                </th>
              ))}
              <th scope="col" title="Points" className={`${headClass} text-gray-900`}>
                Pts
              </th>
              <th scope="col" title="Net run rate" className={headClass}>
                NRR
              </th>
              <th scope="col" className={`${headClass} hidden text-left sm:table-cell`}>
                Form
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const leader = row.position === 1 && row.points > 0
              return (
                <tr key={row.team.id} className="group">
                  <td
                    className={`sticky left-0 z-10 border-t border-l-[3px] border-t-gray-100 bg-white py-2.5 pl-2 pr-3 group-hover:bg-gray-50 ${
                      leader ? 'border-l-red-600' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className={`w-5 shrink-0 text-center text-xs font-black ${leader ? 'text-red-600' : 'text-gray-400'}`}>
                        {row.position}
                      </span>
                      <Avatar src={row.team.logo} name={row.team.name} size="xs" rounded="rounded-lg" />
                      <span className="max-w-[9rem] truncate font-bold text-gray-900 sm:max-w-[14rem]">{row.team.name}</span>
                    </div>
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className={`${cellClass} border-t border-gray-100 group-hover:bg-gray-50`}>
                      {row[column.key]}
                    </td>
                  ))}
                  <td className={`${cellClass} border-t border-gray-100 text-base font-black text-gray-900 group-hover:bg-gray-50`}>
                    {row.points}
                  </td>
                  <td
                    className={`${cellClass} border-t border-gray-100 font-semibold group-hover:bg-gray-50 ${
                      row.netRunRate > 0 ? 'text-red-700' : ''
                    }`}
                  >
                    {formatNrr(row.netRunRate)}
                  </td>
                  <td className="hidden border-t border-gray-100 px-2.5 py-3 group-hover:bg-gray-50 sm:table-cell">
                    <FormChips form={row.form} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PointsTable
