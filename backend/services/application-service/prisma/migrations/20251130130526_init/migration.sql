-- CreateTable
CREATE TABLE `Applications` (
    `application_id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER NOT NULL,
    `candidate_id` INTEGER NOT NULL,
    `status_id` INTEGER NOT NULL,
    `resume_link` VARCHAR(191) NOT NULL,
    `applied_at` DATETIME(3) NOT NULL,

    INDEX `Applications_candidate_id_idx`(`candidate_id`),
    INDEX `Applications_job_id_idx`(`job_id`),
    INDEX `Applications_status_id_idx`(`status_id`),
    PRIMARY KEY (`application_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationStatus` (
    `status_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ApplicationStatus_name_key`(`name`),
    PRIMARY KEY (`status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `ApplicationStatus`(`status_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
