import fs from 'fs';
import { globby } from 'globby';
import lodash from 'lodash';
export const messagesToDeleteFromLocales = [
  'upload_rate_limit_exceeded',
  'keep_me_logged_in',
  'welcome_back',
  'please_login_to_account',
  'new_to_taikai',
  'signup_with',
  'or',
  'reset_pass_description',
  'forgot_password',
  'confirm_account',
  'metamask_verify',
  'metamask_switch_network',
  'metamask_switch_network_description',
  'metamask_signin_description',
  'metamask.errors.generic',
  'metamask.errors.user_rejected_request',
  'metamask.errors.pending_request',
  'overview',
  'updates',
  'positions',
  'results',
  'about',
  'rules',
  'faqs',
  'resources',
  'add_comment',
  'delete_comment',
  'update_comment',
  'show_comments',
  'comment',
  'comment_placeholder',
  'comment_content_error',
  'comment_added_success',
  'comment_deleted_success',
  'comment_updated_success',
  'comment_error',
  'no_resources_available',
  'back_project',
  'action_allocate',
  'action_delegate',
  'action_fund',
  'action_deposit',
  'action_withdraw',
  'action_back',
  'action_transfer',
  'action_close',
  'action_member_dividend',
  'action_jury_dividend',
  'action_collect_ch_unused',
  'action_collect_user_unused',
  'error_loading_updates',
  'stay_tunned',
  'sorry_no_challenges',
  'here_you_can_set_availability',
  'please_login_project',
  'focus_mode',
  'error_loading_juries',
  'title_is_too_short.',
  'deleted_position_success.',
  'in_your',
  'accepted',
  'rejected',
  'deleted',
  'expired',
  'ORGANIZATION',
  'JURY',
  'PARTICIPANT',
  'MENTOR',
  'local_time',
  'h1',
  'change-locale',
  'go_to_blog',
  'products',
  'about_us',
  'retry',
  'launch_challenge',
  'dappkit_desc',
  'press_kit_page_description',
  'follow_us',
  'forgot_password',
  'confirm_account',
  'first_name_value_missing',
  'last_name_value_missing',
  'username_value_missing',
  'email_value_missing',
  'new_email_value_missing',
  'new_email_type_mismatch',
  'password_value_missing',
  'password_too_long',
  'password_too_weak',
  'password_warning',
  'tos_value_missing',
  'login_value_missing',
  'login_pattern_mismatch',
  'project_name_value_missing',
  'project_name_too_short',
  'project_name_too_long',
  'project_description_value_missing',
  'project_description_too_short',
  'project_description_too_long',
  'random',
  'mario_role',
  'mario_bio',
  'helder_role',
  'helder_bio',
  'henrique_role',
  'henrique_bio',
  'maria_role',
  'maria_bio',
  'diogo_role',
  'diogo_bio',
  'rubhan_role',
  'rubhan_bio',
  'rodrigo_role',
  'rodrigo_bio',
  'kacper_role',
  'kacper_bio',
  'carlos_role',
  'carlos_bio',
  'anderson_role',
  'anderson_bio',
  'ines_role',
  'ines_bio',
  'c3_role',
  'c3_bio',
  'pv_role',
  'pv_bio',
  'bright_role',
  'bright_bio',
  'microsoft_role',
  'microsoft_bio',
  'telos_role',
  'telos_bio',
  'eosio_role',
  'eosio_bio',
  'startupjobspt_role',
  'startupjobspt_bio',
  'networkme_role',
  'networkme_bio',
  'blockrocket_role',
  'blockrocket_bio',
  'haze_role',
  'haze_bio',
  'hackathonacademy_role',
  'hackathonacademy_bio',
  'download_all',
  'whats_and_how',
  'whats_taikai',
  'looking_to_download',
  'use_color_proportions',
  'get_high_screen',
  'get_high_assets',
  'logos',
  'colors',
  'screenshots',
  'irl',
  'laptop',
  'tablet',
  'mobile',
  'download',
  'go_challenge',
  'about_us_page_description',
  'feedback',
  'criteria_scale_text',
  'not_enough_balance_criteria_vote',
  'criteria_voting_explained',
  'invalid_amount',
  'go',
  'no_go',
  'update_cart',
  'banner',
  'connect',
  'report.report_project',
  'report.report_modal_title',
  'report.report_modal_description',
  'report.report_modal_button',
  'report.report_success_submission',
  'report.reason.report_reason_copyright',
  'report.reason.report_reason_content',
  'report.reason.report_reason_spam',
  'report.reason.report_reason_other',
  'search_members',
  'my_challenges',
  'my_hiring_challenges',
  'label.current_email',
  'error.email_not_part_domain_list',
  'error.minimum_amount_insufficient',
  'intro',
  'intro_subtitle',
  'test_drive',
  'main_partners',
  'community_first',
  'community_first_title',
  'community_first_desc',
  'hiring_challenge_process',
  'process_step_1',
  'process_step_2',
  'process_step_3',
  'vs_title',
  '48_title',
  '48h_desc',
  'all_in_one_title',
  'all_in_one_desc',
  'real_title',
  'real_desc',
  'clear_title',
  'clear_desc',
  'reward_title',
  'reward_desc',
  'assessment_title',
  'assessment_desc',
  'implementation_title',
  'implementation_desc',
  'pricing_title',
  'pricing_description',
  'start_free_trial_success',
  'start_free_trial_error',
  'pricing_card_launch',
  'pricing_card_desc',
  'pricing_card_free',
  'pricing_card_1',
  'pricing_card_2',
  'pricing_card_3',
  'want_test_drive',
  'hire_more',
  'hiring_form_desc',
  'hero title',
  'hero subtitle',
  'join a hackathon',
  'discover bounties',
  'know more',
  'hero img alt',
  'what we do',
  'what we do hackathons title',
  'what we do hackathons description',
  'what we do hackathons explore',
  'what we do bounties title',
  'what we do bounties description',
  'what we do bounties explore',
  'what we do sdk title',
  'what we do sdk description',
  'what we do sdk explore',
  'days left',
  'hours left',
  'featured hackathons title',
  'featured hackathons description',
  'featured hackathons cta',
  'featured bounties title',
  'featured bounties description',
  'featured bounties cta',
  'product value',
  'value 1 title',
  'value 1 description',
  'value 2 title',
  'value 2 description',
  'value 3 title',
  'value 3 description',
  'value 4 title',
  'value 4 description',
  'partners title',
  'partners description',
  'blog description',
  'see all articles',
  'newsletter description',
  'newsletter subscribe',
  'join discord',
  'invalid email',
  'email already subscribed',
  'email subscribed',
  'whos_taikai',
  'whos_taikai_desc',
  'clients',
  'what_we_do_desc',
  'what_we_do_for',
  'hackathons_desc',
  'bounties',
  'bounties_desc',
  'hiring',
  'hiring_desc',
  'funding_desc',
  'developers',
  'prizes_desc',
  'earn',
  'earn_desc',
  'recognition',
  'recognition_desc',
  'get_funded',
  'get_funded_desc',
  'what_we_do_for_1',
  'what_we_do_for_2',
  'brand_taikai',
  'brand_bepro',
  'create_spaces',
  'discover_team',
  'expand_skills',
  'compete',
  'bepro_by_taikai',
  'investors',
  'newsletter_placeholder',
  'network_error',
  'live',
  'intro',
  'intro_subtitle',
  'main_partners',
  'what_can_we_offer',
  'online_hackathons',
  'online_hackathons_desc',
  'private_hackathons',
  'private_hackathons_desc',
  'hiring_challenges',
  'hiring_challenges_desc',
  'feature_all_in_one',
  'feature_all_in_one_desc',
  'feature_talent',
  'feature_talent_desc',
  'feature_experts',
  'feature_experts_desc',
  'feature_virtual_teams',
  'feature_virtual_teams_desc',
  'feature_dashboard',
  'feature_dashboard_desc',
  'feature_votting',
  'feature_votting_desc',
  'launch_your_challenge_desc',
  'connect_taikai_title',
  'connect_taikai_desc',
  'sponsorship_button',
  'success_stories_l1',
  'success_stories_l2',
  'featured_challenges',
  'about',
  'prizes_paid',
  'request_demo_success',
  'request_demo_error',
  'custom_solution_title',
  'custom_solution_desc',
  'custom_solution_button',
  'ranking_explained_p1',
  'ranking_explained_p2',
  'verify_code',
  'for_each_friend_until',
  'please_insert_phone_number',
  'connected_accounts.connect_metamask_wallet_description',
  'testimonials_title',
  'testimonial_celso',
  'testimonial_carla',
  'testimonial_glintt',
  'testimonial_eduardo',
  'testimonial_rafael_pires',
  'testimonial_joao_castro',
  'testimonial_pranav_dulepet',
  'testimonial_freyr_ketilsson',
  'title_placeholder',
  'profile_image',
  'taikai_pitch',
  'overview',
  'no_gender',
  'no_birth_date',
];

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
const replaceAll = (str: string, find: string, replace: string) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

function removeKeys(obj, keys) {
  var index;
  for (var prop in obj) {
    // important check that this is objects own property
    // not from prototype prop inherited
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'string':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          }
          break;
        case 'object':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          } else {
            removeKeys(obj[prop], keys);
          }
          break;
      }
    }
  }
}

const extractKeys = async () => {
  const notReadingDir = ['lib/**/frontend/**', '!**.ts'];
  const files = await globby(notReadingDir);

  // let messagesToDeleteMap: Record<string, number> = {};

  for await (const filePath of files) {
    const fileWithMessages = await import('../' + filePath);
    const messagesToDeleteMap: Record<string, number> = { ...fileWithMessages['default'] };

    removeKeys(messagesToDeleteMap, messagesToDeleteFromLocales);

    fs.writeFile(filePath, JSON.stringify(messagesToDeleteMap, null, 2), (err) => {
      if (err) console.log('error', err);
    });
  }

  // const data = files.reduce((acc, filePath) => {
  //   const fileWithMessages = import('../' + filePath);

  //   const messagesMapped = messagesToDeleteFromLocales.reduce((acc, messageKey) => {
  //     const foundMessage = fileWithMessages?.[messageKey];
  //     if (!foundMessage) {
  //       return (messagesToDeleteMap = {
  //         ...acc,
  //         [messageKey]: 1,
  //       });
  //     }

  //     const count = messagesToDeleteMap?.[messageKey] ?? 0;

  //     return (messagesToDeleteMap = {
  //       ...acc,
  //       [messageKey]: count + 1,
  //     });
  //   }, {} as Record<string, number>);

  //   return [...acc, ...Object.keys(messagesMapped)];
  // }, [] as string[]);

  // // console.log(
  //   Object.entries(messagesToDeleteMap).map(([key, value]) => {
  //     console.log(`${key}: ${value}`);
  //     return `${key}: ${value}`;
  //   })
  // );
  // fs.writeFile(
  //   './scripts/locales-unused-messages.txt',
  //   replaceAll(
  //     Object.entries(messagesToDeleteMap)
  //       .map(([key, value]) => {
  //         console.log(`${key}: ${value}`);
  //         return `${key}: ${value}`;
  //       })
  //       .sort()
  //       .toString(),
  //     ',',
  //     '\n'
  //   ),
  //   (err) => {
  //     if (err) console.log('error', err);
  //   }
  // );
};
(async () => await extractKeys())();