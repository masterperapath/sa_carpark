CREATE OR REPLACE FUNCTION audit.em29_select_setup_box(pi_mid character varying, pi_entry_code character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR

    SELECT cre.i_mid_id AS f_mid,
        COALESCE(bp.c_plate_number,bp.c_car_code) AS f_plate_no,
        prmd.c_prmd_entry_desc AS f_cmd,
        prmd.c_prmd_comment AS f_cmd_desc,
        COALESCE(cre.c_cre_value,'') AS f_cmd_value,
        COALESCE(prmd.c_prmd_value_1,'') AS f_cmd_value_desc,
        (CASE WHEN gprso.status = 'S' THEN 'สำเร็จ' ELSE 'ไม่สำเร็จ' END) AS f_cmd_status,
        -- For show second page when update mode.
        cre.i_mid_id AS s_mid,
        prmd.c_prmd_entry_code AS s_entry_cd,
        prmd.c_prmd_comment AS s_cmd_desc,
        COALESCE(cre.c_cre_value,'') AS s_cmd_value,
        COALESCE(prmd.c_prmd_value_1,'') AS param1,
	    COALESCE(prmd.c_prmd_value_2,'') AS param2,
	    prmd.c_prmd_value_3 AS param3,
	    prmd.c_prmd_value_4 AS param4,
	    COALESCE(prmd.c_prmd_value_5,'') AS param5
    FROM config_receiver_expansion cre
    JOIN parameter_header prmh ON (cre.i_cre_prm_no = prmh.i_prmh_no)
    JOIN parameter_detail prmd ON (cre.i_cre_prm_no = prmd.i_prmh_no 
    AND cre.c_cre_entry_code = prmd.c_prmd_entry_code)
    JOIN box_profile bp ON (cre.i_mid_id = bp.i_mid_id)
    JOIN gprsserver_out gprso ON (cre.c_cre_gprsout_referent_id = gprso.id)
    WHERE cre.i_mid_id = pi_mid::NUMERIC
    AND prmd.c_prmd_entry_code LIKE '%'||COALESCE(pi_entry_code,'')||'%'
    ORDER BY prmd.c_prmd_entry_code;

    RETURN po_cursor;
END
$function$
