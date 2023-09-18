import { SummaryType } from '@enums';

export const getSummaryQuery = (summaryType: SummaryType) => {
  const params = new Map<string, string>()
    .set('firstOutbound', "firstnotificationdate != '' AND secondnotificationdate = ''")
    .set('secondOutbound', "secondnotificationdate != ''")
    .set('firstInbound', "firstnotificationdate != '' AND secondnotificationdate = '' AND emailresponsedate !=''")
    .set('secondInbound', "secondnotificationdate != '' AND emailresponsedate != ''")
    .set('invalid', "status = 'Skipped'")
    .set('noResponse', "emailresponsedate = '' AND thirdnotificationdate != ''") // "emailresponsedate = '' AND status != 'Skipped' AND status != 'Completed'"
    .set('totalOutbound', "firstnotificationdate != ''")
    .set('totalInbound', "emailresponsedate !=''") // "firstnotificationdate != '' AND emailresponsedate !=''"
    .set('noChange', "(lconconfirmed IS NOT NULL OR lconconfirmed != '')")
    .set('lconChange', "(lconchange IS NOT NULL OR lconchange != '')")
    .set('alconChange', "(alconchange IS NOT NULL OR alconchange != '')")
    .set('demarcChange', "(demarcchange IS NOT NULL OR demarcchange != '')")
    .set('totalSuccessful', "status = 'Completed'")
    .set('totalFailed', "status = 'Fallout'");

  params.set('totalUnreachable', `(${params.get('invalid')} OR ${params.get('noResponse')})`);

  return params.get(summaryType);
};
