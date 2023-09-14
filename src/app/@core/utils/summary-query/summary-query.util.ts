import { SummaryType } from '@enums';

export const getSummaryQuery = (summaryType: SummaryType) => {
  const params = new Map<string, string>()
    .set('firstOutbound', 'firstnotificationdate IS NOT NULL AND secondnotificationdate IS NULL')
    .set('secondOutbound', 'secondnotificationdate IS NOT NULL')
    .set(
      'firstInbound',
      'firstnotificationdate IS NOT NULL AND secondnotificationdate IS NULL AND emailresponsedate IS NOT NULL',
    )
    .set('secondInbound', 'secondnotificationdate IS NOT NULL AND emailresponsedate IS NOT NULL')
    .set('invalid', "status LIKE '%Skipped%'")
    .set('noResponse', 'emailresponsedate IS NULL AND thirdnotificationdate IS NOT NULL') // "emailresponsedate IS NULL AND status != 'Skipped' AND status != 'Completed'"
    .set('totalOutbound', 'firstnotificationdate IS NOT NULL')
    .set('totalInbound', 'emailresponsedate IS NOT NULL') // "firstnotificationdate IS NOT NULL AND emailresponsedate IS NOT NULL"
    .set('noChange', "(lconconfirmed IS NOT NULL OR lconconfirmed != '')")
    .set('lconChange', "(lconchange IS NOT NULL OR lconchange != '')")
    .set('alconChange', "(alconchange IS NOT NULL OR alconchange != '')")
    .set('demarcChange', "(demarcchange IS NOT NULL OR demarcchange != '')")
    .set('totalSuccessful', "status LIKE '%Completed%'")
    .set('totalFailed', "status LIKE '%Fallout%'");

  params.set('totalUnreachable', `(${params.get('invalid')} OR ${params.get('noResponse')})`);

  return params.get(summaryType);
};
