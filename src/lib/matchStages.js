export const MATCH_STAGES = [
  { value: 'group_stage', label: 'Group Stage' },
  { value: 'eliminator', label: 'Eliminator' },
  { value: 'qualifier', label: 'Qualifier' },
  { value: 'quarter_final', label: 'Quarter Final' },
  { value: 'semi_final', label: 'Semi Final' },
  { value: 'final', label: 'Final' },
]

export const matchStageLabel = (value) => MATCH_STAGES.find((stage) => stage.value === value)?.label ?? null
