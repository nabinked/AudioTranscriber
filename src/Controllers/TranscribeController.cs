using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.TranscribeService;
using Amazon.TranscribeService.Model;
using Audio2Text.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Audio2Text.Controllers
{
    [Route("job")]
    public class TranscribeController : Controller
    {
        private readonly IAmazonS3 _amazonS3;
        private readonly IAmazonTranscribeService _transcribeService;
        private const string BucketName = "upgrowth-transcribe-audios";

        public TranscribeController(IAmazonS3 amazonS3, IAmazonTranscribeService transcribeService)
        {
            _amazonS3 = amazonS3;
            _transcribeService = transcribeService;
        }
        [HttpGet("")]
        public async Task<IActionResult> List()
        {
            var jobs = await _transcribeService.ListTranscriptionJobsAsync(new ListTranscriptionJobsRequest()
            {
                MaxResults = 50,
                JobNameContains = Constants.TranscribeJobPrefix,
            });
            var model = new HomeViewModel()
            {
                ListTranscriptionJobsResponse = jobs
            };
            return Json(model);
        }
        [HttpGet("{jobName}")]
        public async Task<IActionResult> Get(string jobName)
        {
            var jobResponse = await _transcribeService.GetTranscriptionJobAsync(new GetTranscriptionJobRequest()
            {
                TranscriptionJobName = jobName
            });
            return Json(jobResponse.TranscriptionJob);
        }

        [HttpPost("")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Transcribe(IFormFile file)
        {
            if (file != null)
            {
                var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                var fileExtension = Path.GetExtension(file.FileName);
                var stream = file.OpenReadStream();
                if (!await _amazonS3.DoesS3BucketExistAsync(BucketName))
                {
                    await _amazonS3.PutBucketAsync(BucketName);
                }
                var key = $"{fileName}-{Guid.NewGuid()}{fileExtension}";
                var properties = new Dictionary<string, object>();
                await _amazonS3.UploadObjectFromStreamAsync(BucketName, key, stream, properties);
                var transcriptionJobs = await _transcribeService.StartTranscriptionJobAsync(new StartTranscriptionJobRequest()
                {
                    Media = GetMedia(key),
                    LanguageCode = "en-US",
                    MediaFormat = fileExtension.Replace(".", ""),
                    TranscriptionJobName = $"{Constants.TranscribeJobPrefix}-{fileName}-{Guid.NewGuid()}"
                });
                return Json(transcriptionJobs.TranscriptionJob);
            }

            return BadRequest("file not provided");
        }

        private Media GetMedia(string key)
        {
            return new Media()
            {
                MediaFileUri = $"https://s3-us-west-2.amazonaws.com/{BucketName}/{key}"
            };
        }
    }
}
